import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import moment from 'moment';

interface Program {
    dateCompleted?: string;
    states: Array<{ state: { concept: { display: string } }, startDate: string, voided?: boolean }>;
}

interface TimelineProps {
    program: Program;
}

const Timeline: React.FC<TimelineProps> = ({ program }) => {
    const timelineRef = useRef<SVGSVGElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const dateUtil = {
            parse: (date: string) => new Date(date)
        };
        const data = getDataModel(program);
        const svg = d3.select(timelineRef.current);
        const elementDimension = timelineRef.current?.getBoundingClientRect();
        const sortedDates = _.map(data.states, 'date');
        const xMin = 0;
        const xMax = (elementDimension?.width || 0) - 15;
        const endDate = program.dateCompleted ? dateUtil.parse(program.dateCompleted) : new Date();
        const dateFormatter = d3.timeFormat("%_d %b%y");

        const timeScale = d3.scaleTime()
            .domain([sortedDates[0], endDate])
            .range([xMin, xMax]);

        const states = svg.selectAll('.states').data(data.states);
        const stateGroup = states.enter().append("g").classed('states', true);
        const tooltipEl = d3.select(tooltipRef.current);
        const showTooltip = function (d: any) {
            const eventEl = this;
            tooltipEl
                .html(() => dateFormatter(d.date) + " | " + d.state)
                .style("left", function () {
                    const tooltipWidth = this.getBoundingClientRect().width;
                    const eventX = eventEl.getBBox().x;
                    const posX = (eventX + tooltipWidth > (elementDimension?.width || 0)) ? ((elementDimension?.width || 0) - tooltipWidth) : eventX;
                    return posX + "px";
                })
                .style("visibility", "visible");
        };
        stateGroup.append("rect").classed("label-bg", true);
        stateGroup.append("text").classed("label", true);
        stateGroup.append("rect").classed("date-bg", true);
        stateGroup.append("line").classed("date-line", true);
        stateGroup.append("text").classed("date", true);

        const stateBar = { y: 5, height: 23, textPaddingX: 6 };
        const dateBar = { y: 30, height: 30, xPadding: -4, textPaddingY: 53 };
        const dateTick = { y: 0, height: 40 };
        states.select(".label-bg")
            .attr('x', (d: any) => timeScale(d.date))
            .attr('y', stateBar.y)
            .attr('height', stateBar.height)
            .attr('width', (d: any) => xMax - timeScale(d.date));
        states.select(".label")
            .attr('x', (d: any) => timeScale(d.date) + stateBar.textPaddingX)
            .attr('y', stateBar.y + (stateBar.height * 0.7))
            .text((d: any) => d.state);
        states.select(".date-bg")
            .attr('x', (d: any) => timeScale(d.date) + dateBar.xPadding)
            .attr('y', dateBar.y)
            .attr('height', dateBar.height)
            .attr('width', xMax);
        states.select(".date-line")
            .attr('x1', (d: any) => timeScale(d.date))
            .attr('y1', dateTick.y)
            .attr('x2', (d: any) => timeScale(d.date))
            .attr('y2', dateTick.y + dateTick.height);
        states.select(".date")
            .attr('x', (d: any) => timeScale(d.date))
            .attr('y', dateBar.textPaddingY)
            .text((d: any) => dateFormatter(d.date));

        states.select(".label-bg").on("mouseenter", showTooltip);
        states.select(".label-bg").on("click", showTooltip);
        states.select(".label-bg").on("mouseout", () => {
            tooltipEl.style("visibility", "hidden");
        });

        // Draw completed state
        if (!data.completed && !_.isEmpty(data.states)) {
            svg.append("polygon")
                .attr("points", `${xMax},${stateBar.y} ${(xMax + 12)},${(stateBar.y + stateBar.height / 2)} ${(xMax - 1)},${(stateBar.y + stateBar.height)}`);
        }
    }, [program]);

    const getActiveProgramStates = (patientProgram: Program) => {
        return _.reject(patientProgram.states, (st) => st.voided);
    };

    const getDataModel = (program: Program) => {
        const states = _.sortBy(_.map(getActiveProgramStates(program), (stateObject) => {
            return { state: stateObject.state.concept.display, date: moment(stateObject.startDate).toDate() };
        }), 'date');
        const completed = isProgramCompleted(program);
        return { states: states, completed: completed };
    };

    const isProgramCompleted = (program: Program) => {
        return !_.isEmpty(program.dateCompleted);
    };

    return (
        <div className="timeline-view">
            <svg ref={timelineRef}></svg>
            <div className="tool-tip" ref={tooltipRef}></div>
        </div>
    );
};

export default Timeline;
