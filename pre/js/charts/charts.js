//Desarrollo de las visualizaciones
import { numberWithCommas3 } from '../helpers';
import { getInTooltip, getOutTooltip, positionTooltip } from '../modules/tooltip';
import { setChartHeight } from '../modules/height';
import { setChartCanvas, setChartCanvasImage } from '../modules/canvas-image';
import { setRRSSLinks } from '../modules/rrss';
import { setFixedIframeUrl } from './chart_helpers';

//Colores fijos
const COLOR_PRIMARY_1 = '#F8B05C',
COLOR_COMP_2 = '#AADCE0',
COLOR_ANAG__PRIM_1 = '#BA9D5F',
COLOR_ANAG_COMP_1 = '#1C5A5E';
let tooltip = d3.select('#tooltip');

export function initChart(iframe) {
    //Desarrollo del gráfico
    d3.json('https://raw.githubusercontent.com/CarlosMunozDiazCSIC/informe_perfil_mayores_2022_social_4_4/main/data/json_sankey_quien_cuida_a_quien.json', function(error,data) {
        if (error) throw error;

        let margin = {top: 5, right: 0, bottom: 0, left: 0},
            width = document.getElementById('chart').clientWidth - margin.left - margin.right,
            height = document.getElementById('chart').clientHeight - margin.top - margin.bottom;

        let svg = d3.select("#chart")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let sankey = d3.sankey()
            .nodeWidth(20)
            .nodePadding(5)
            .extent([[1, 1], [width - 1, height - 6]]);

        let link = svg.append("g")
            .attr("class", "links")
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.25)
            .selectAll("path");

        let node = svg.append("g")
            .attr("class", "nodes")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("g");

        sankey(data);

        let color = d3.scaleOrdinal()
            .domain(['Hombres < 65','Hombres 65+','Mujeres < 65','Mujeres 65+'])
            .range([COLOR_PRIMARY_1, COLOR_ANAG__PRIM_1, COLOR_COMP_2, COLOR_ANAG_COMP_1]);

        function init() {
            link = link
                .data(data.links)
                .enter()
                .append("path")
                .attr('class', 'rect')
                .attr("d", d3.sankeyLinkHorizontal())
                .attr("stroke-width", function(d) { return Math.max(1, d.width); })
                .attr('stroke', function(d) { return color(d.source.name); })
                .on('mouseover', function(d,i,e) {
                    //Opacidad del link señalado
                    this.style.strokeOpacity = 1;



                    //Texto en tooltip
                    let html = '<p class="chart__tooltip--title_1">Horas de cuidado: ' + numberWithCommas3(parseInt(d.value)) + '</p>' +
                        '<p class="chart__tooltip--title_2">Cuidador: ' + d.source.name + '</p>' + 
                        '<p class="chart__tooltip--text">El <b>' + numberWithCommas3((parseInt(d.value) / parseInt(d.source.value) * 100).toFixed(1)) + '%</b> del tiempo cuidan a estas personas</p>' +
                        '<p class="chart__tooltip--title_3">Dependiente: ' + d.target.name + '</p>' + 
                        '<p class="chart__tooltip--text">El <b>' + numberWithCommas3((parseInt(d.value) / parseInt(d.target.value) * 100).toFixed(1)) + '%</b> del tiempo que reciben cuidados, lo reciben por parte de este tipo de cuidador</p>';
                
                    tooltip.html(html);

                    //Tooltip
                    positionTooltip(window.event, tooltip);
                    getInTooltip(tooltip);

                })
                .on('mouseout', function(d,i,e) {
                    //Opacidad del link señalado
                    this.style.strokeOpacity = 0.25;

                    //Fuera tooltip
                    getOutTooltip(tooltip);
                })

            node = node
                .data(data.nodes)
                .enter()
                .append("g");

            node.append("rect")
                .attr("x", function(d) { return d.x0; })
                .attr("y", function(d) { return d.y0; })
                .attr("height", function(d) { return d.y1 - d.y0; })
                .attr("width", function(d) { return d.x1 - d.x0; })
                .attr("fill", function(d) { return color(d.name); });

            node.append('text')     
                .attr('class','sankey-text')
                .attr("x", function(d) { return d.x0 - 6; })
                .attr("y", function(d) { return (d.y1 + d.y0) / 2 - 10; })
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .text(function(d) { return d.name; })
                .filter(function(d) { return d.x0 < width / 2; })
                .attr("x", function(d) { return d.x1 + 6; })
                .attr("text-anchor", "start")

            node.append('text')
                .attr('class','sankey-text')
                .attr("x", function(d) { return d.x0 - 6; })
                .attr("y", function(d) { return (d.y1 + d.y0) / 2 + 10; })
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .text(function(d) { return ' (' + numberWithCommas3(parseInt(d.value)) + ' horas)'; })
                .filter(function(d) { return d.x0 < width / 2; })
                .attr("x", function(d) { return d.x1 + 6; })
                .attr("text-anchor", "start")
        }

        /////
        /////
        // Resto - Chart
        /////
        /////
        init();

        /////
        /////
        // Resto
        /////
        /////        

        //Iframe
        setFixedIframeUrl('informe_perfil_mayores_2022_social_4_4','patrones_cuidado_informal');

        //Redes sociales > Antes tenemos que indicar cuál sería el texto a enviar
        setRRSSLinks('patrones_cuidado_informal');

        //Captura de pantalla de la visualización
        setChartCanvas();

        let pngDownload = document.getElementById('pngImage');

        pngDownload.addEventListener('click', function(){
            setChartCanvasImage('patrones_cuidado_informal');
        });

        //Altura del frame
        setChartHeight(iframe);
    });    
}