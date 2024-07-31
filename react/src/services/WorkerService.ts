import { useState, useEffect } from 'react';

interface ServiceToUrlMap {
    [key: string]: {
        url: string;
        moduleName: string;
    };
}

interface Storage {
    [key: string]: any;
}

interface DependencyMetaData {
    dependencies: string[];
    moduleList: string;
    angularDepsAsStrings: string;
    angularDepsAsParamList: string;
    servicesIncludeStatements: string;
    workerFuncParamList: string;
}

class WorkerService {
    private urlToAngular: string;
    private serviceToUrlMap: ServiceToUrlMap;
    private storage: Storage;
    private scriptsToLoad: string[];
    private workerTemplate: string;

    constructor() {
        this.urlToAngular = 'http://localhost:9876/base/bower_components/angular/angular.js';
        this.serviceToUrlMap = {};
        this.storage = {};
        this.scriptsToLoad = [];
        this.workerTemplate = this.createAngularWorkerTemplate();
    }

    setAngularUrl(urlToAngularJs: string) {
        this.urlToAngular = urlToAngularJs;
    }

    private createAngularWorkerTemplate(): string {
        const workerTemplate = [
            '',
            'var window = self;',
            'self.history = {};',
            'var Node = function() {};',
            'var app',
            'var localStorage = {storage: <STORAGE>, getItem: function(key) {return this.storage[key]}, setItem: function(key, value) {this.storage[key]=value}}',
            'var document = {',
            '      readyState: \'complete\',',
            '      cookie: \'\',',
            '      querySelector: function () {},',
            '      createElement: function () {',
            '          return {',
            '              pathname: \'\',',
            '              setAttribute: function () {}',
            '          };',
            '      }',
            '};',
            'importScripts(\'<URL_TO_ANGULAR>\');',
            '<CUSTOM_DEP_INCLUDES>',
            'angular = window.angular;',
            'var workerApp = angular.module(\'WorkerApp\', [<DEP_MODULES>]);',
            'workerApp.run([\'$q\'<STRING_DEP_NAMES>, function ($q<DEP_NAMES>) {',
            '  self.addEventListener(\'message\', function(e) {',
            '    var input = e.data;',
            '    var output = $q.defer();',
            '    var promise = output.promise;',
            '    promise.then(function(success) {',
            '      self.postMessage({event:\'success\', data : success});',
            '    }, function(reason) {',
            '      self.postMessage({event:\'failure\', data : reason});',
            '    }, function(update) {',
            '      self.postMessage({event:\'update\', data : update});',
            '    });',
            '    <WORKER_FUNCTION>;',
            '  });',
            '  self.postMessage({event:\'initDone\'});',
            '}]);',
            'angular.bootstrap(null, [\'WorkerApp\']);'
        ];
        return workerTemplate.join('\n');
    }

    addDependency(serviceName: string, moduleName: string, url: string) {
        this.serviceToUrlMap[serviceName] = {
            url: url,
            moduleName: moduleName
        };
    }

    includeScripts(url: string) {
        this.scriptsToLoad.push(url);
    }

    addToLocalStorage(key: string, value: any) {
        this.storage[key] = value;
    }

    private createIncludeStatements(listOfServiceNames: string[]): string {
        let includeString = '';
        this.scriptsToLoad.forEach(script => {
            includeString += `importScripts('${script}');`;
        });

        listOfServiceNames.forEach(serviceName => {
            if (this.serviceToUrlMap[serviceName]) {
                includeString += `importScripts('${this.serviceToUrlMap[serviceName].url}');`;
            }
        });
        return includeString;
    }

    private createModuleList(listOfServiceNames: string[]): string {
        const moduleNameList: string[] = [];
        listOfServiceNames.forEach(serviceName => {
            if (this.serviceToUrlMap[serviceName]) {
                moduleNameList.push(`'${this.serviceToUrlMap[serviceName].moduleName}'`);
            }
        });
        return moduleNameList.join(',');
    }

    private createDependencyMetaData(dependencyList: string[]): DependencyMetaData {
        const dependencyServiceNames = dependencyList.filter(dep => dep !== 'input' && dep !== 'output' && dep !== '$q');
        const depMetaData: DependencyMetaData = {
            dependencies: dependencyServiceNames,
            moduleList: this.createModuleList(dependencyServiceNames),
            angularDepsAsStrings: dependencyServiceNames.length > 0 ? ',' + dependencyServiceNames.map(dep => `'${dep}'`).join(',') : '',
            angularDepsAsParamList: dependencyServiceNames.length > 0 ? ',' + dependencyServiceNames.join(',') : '',
            servicesIncludeStatements: this.createIncludeStatements(dependencyServiceNames),
            workerFuncParamList: 'input,output' + (dependencyServiceNames.length > 0 ? ',' + dependencyServiceNames.join(',') : '')
        };
        return depMetaData;
    }

    private populateWorkerTemplate(workerFunc: Function, dependencyMetaData: DependencyMetaData): string {
        return this.workerTemplate
            .replace('<URL_TO_ANGULAR>', this.urlToAngular)
            .replace('<CUSTOM_DEP_INCLUDES>', dependencyMetaData.servicesIncludeStatements)
            .replace('<DEP_MODULES>', dependencyMetaData.moduleList)
            .replace('<STRING_DEP_NAMES>', dependencyMetaData.angularDepsAsStrings)
            .replace('<DEP_NAMES>', dependencyMetaData.angularDepsAsParamList)
            .replace('<STORAGE>', JSON.stringify(this.storage))
            .replace('<WORKER_FUNCTION>', workerFunc.toString());
    }

    private buildAngularWorker(initializedWorker: Worker) {
        const that: any = {};
        that.worker = initializedWorker;
        that.run = function (input: any) {
            return new Promise((resolve, reject) => {
                initializedWorker.addEventListener('message', function (e) {
                    const eventId = e.data.event;
                    if (eventId === 'initDone') {
                        throw 'Received worker initialization in run method. This should already have occurred!';
                    } else if (eventId === 'success') {
                        resolve(e.data.data);
                    } else if (eventId === 'failure') {
                        reject(e.data.data);
                    } else if (eventId === 'update') {

                        // Handle update event if needed
                        // Assuming we want to notify the caller about the update
                        if (typeof deferred.notify === 'function') {
                            deferred.notify(e.data.data);
                        }
                        reject(e);
                    }
                });
                initializedWorker.postMessage(input);
            });
        };
        that.terminate = function () {
            initializedWorker.terminate();
        };
        return that;
    }

    private extractDependencyList(depFuncList: any[]): string[] {
        return depFuncList.slice(0, depFuncList.length - 1);
    }

    private workerFunctionToString(func: Function, paramList: string): string {
        return `(${func.toString()})(${paramList})`;
    }

    createAngularWorker(depFuncList: any[]) {
        if (!Array.isArray(depFuncList) || depFuncList.length < 3 || typeof depFuncList[depFuncList.length - 1] !== 'function') {
            throw 'Input needs to be: [\'workerInput\',\'deferredOutput\'/*optional additional dependencies*/,\n' + '    function(workerInput, deferredOutput /*optional additional dependencies*/)\n' + '        {/*worker body*/}' + ']';
        }
        return new Promise((resolve, reject) => {
            const dependencyMetaData = this.createDependencyMetaData(this.extractDependencyList(depFuncList));
            const blobURL = (window.webkitURL ? webkitURL : URL).createObjectURL(new Blob([this.populateWorkerTemplate(this.workerFunctionToString(depFuncList[depFuncList.length - 1], dependencyMetaData.workerFuncParamList), dependencyMetaData)], { type: 'application/javascript' }));
            const worker = new Worker(blobURL);
            worker.addEventListener('message', function (e) {
                const eventId = e.data.event;
                if (eventId === 'initDone') {
                    resolve(this.buildAngularWorker(worker));
                } else {
                    reject(e);
                }
            });
        });
    }
}

export default WorkerService;
