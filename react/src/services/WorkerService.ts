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

const WorkerService = () => {
    let urlToAngular = 'http://localhost:9876/base/bower_components/angular/angular.js';
    const serviceToUrlMap: ServiceToUrlMap = {};
    const storage: Storage = {};
    const scriptsToLoad: string[] = [];

    const setAngularUrl = (urlToAngularJs: string) => {
        urlToAngular = urlToAngularJs;
    };

    const createAngularWorkerTemplate = () => {
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
            'angular.bootstrap(null, [\'WorkerApp\']);',
        ];
        return workerTemplate.join('\n');
    };

    const workerTemplate = createAngularWorkerTemplate();

    const addDependency = (serviceName: string, moduleName: string, url: string) => {
        serviceToUrlMap[serviceName] = {
            url: url,
            moduleName: moduleName
        };
    };

    const includeScripts = (url: string) => {
        scriptsToLoad.push(url);
    };

    const addToLocalStorage = (key: string, value: any) => {
        storage[key] = value;
    };

    const createIncludeStatements = (listOfServiceNames: string[]) => {
        let includeString = '';
        scriptsToLoad.forEach(script => {
            includeString += `importScripts('${script}');`;
        });

        listOfServiceNames.forEach(serviceName => {
            if (serviceToUrlMap[serviceName]) {
                includeString += `importScripts('${serviceToUrlMap[serviceName].url}');`;
            }
        });
        return includeString;
    };

    const createModuleList = (listOfServiceNames: string[]) => {
        const moduleNameList: string[] = [];
        listOfServiceNames.forEach(serviceName => {
            if (serviceToUrlMap[serviceName]) {
                moduleNameList.push(`'${serviceToUrlMap[serviceName].moduleName}'`);
            }
        });
        return moduleNameList.join(',');
    };

    const createDependencyMetaData = (dependencyList: string[]): DependencyMetaData => {
        const dependencyServiceNames = dependencyList.filter(dep => dep !== 'input' && dep !== 'output' && dep !== '$q');
        const depMetaData: DependencyMetaData = {
            dependencies: dependencyServiceNames,
            moduleList: createModuleList(dependencyServiceNames),
            angularDepsAsStrings: dependencyServiceNames.length > 0 ? ',' + dependencyServiceNames.map(dep => `'${dep}'`).join(',') : '',
            angularDepsAsParamList: dependencyServiceNames.length > 0 ? ',' + dependencyServiceNames.join(',') : '',
            servicesIncludeStatements: createIncludeStatements(dependencyServiceNames),
            workerFuncParamList: 'input,output' + (dependencyServiceNames.length > 0 ? ',' + dependencyServiceNames.join(',') : '')
        };
        return depMetaData;
    };

    const populateWorkerTemplate = (workerFunc: Function, dependencyMetaData: DependencyMetaData) => {
        return workerTemplate
            .replace('<URL_TO_ANGULAR>', urlToAngular)
            .replace('<CUSTOM_DEP_INCLUDES>', dependencyMetaData.servicesIncludeStatements)
            .replace('<DEP_MODULES>', dependencyMetaData.moduleList)
            .replace('<STRING_DEP_NAMES>', dependencyMetaData.angularDepsAsStrings)
            .replace('<DEP_NAMES>', dependencyMetaData.angularDepsAsParamList)
            .replace('<STORAGE>', JSON.stringify(storage))
            .replace('<WORKER_FUNCTION>', workerFunc.toString());
    };

    const buildAngularWorker = (initializedWorker: Worker) => {
        const run = (input: any) => {
            return new Promise((resolve, reject) => {
                initializedWorker.addEventListener('message', (e) => {
                    const eventId = e.data.event;
                    if (eventId === 'initDone') {
                        throw 'Received worker initialization in run method. This should already have occurred!';
                    } else if (eventId === 'success') {
                        resolve(e.data.data);
                    } else if (eventId === 'failure') {
                        reject(e.data.data);
                    } else if (eventId === 'update') {

                        // Handle update event if needed
                        console.log('Update event received:', e.data.data);
                        // You can add more logic here to handle the update event as required
                    } else {
                        reject(e);
                    }
                });
                initializedWorker.postMessage(input);
            });
        };

        const terminate = () => {
            initializedWorker.terminate();
        };

        return { run, terminate };
    };

    const extractDependencyList = (depFuncList: any[]) => {
        return depFuncList.slice(0, depFuncList.length - 1);
    };

    const workerFunctionToString = (func: Function, paramList: string) => {
        return `(${func.toString()})(${paramList})`;
    };

    const createAngularWorker = (depFuncList: any[]) => {
        if (!Array.isArray(depFuncList) || depFuncList.length < 3 || typeof depFuncList[depFuncList.length - 1] !== 'function') {
            throw 'Input needs to be: [\'workerInput\',\'deferredOutput\'/*optional additional dependencies*/,\n' + '    function(workerInput, deferredOutput /*optional additional dependencies*/)\n' + '        {/*worker body*/}' + ']';
        }

        return new Promise((resolve, reject) => {
            const dependencyMetaData = createDependencyMetaData(extractDependencyList(depFuncList));
            const blobURL = (window.webkitURL ? webkitURL : URL).createObjectURL(new Blob([populateWorkerTemplate(workerFunctionToString(depFuncList[depFuncList.length - 1], dependencyMetaData.workerFuncParamList), dependencyMetaData)], { type: 'application/javascript' }));
            const worker = new Worker(blobURL);

            worker.addEventListener('message', (e) => {
                const eventId = e.data.event;
                if (eventId === 'initDone') {
                    resolve(buildAngularWorker(worker));
                } else {
                    reject(e);
                }
            });
        });
    };

    return {
        setAngularUrl,
        addDependency,
        includeScripts,
        addToLocalStorage,
        createAngularWorker
    };
};

export default WorkerService;
