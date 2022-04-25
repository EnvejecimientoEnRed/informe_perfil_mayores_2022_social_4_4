//Desarrollo de las visualizaciones
import { numberWithCommas2 } from '../helpers';
//import { getInTooltip, getOutTooltip, positionTooltip } from './modules/tooltip';
import { setChartHeight } from '../modules/height';
import { setChartCanvas, setChartCanvasImage } from '../modules/canvas-image';
import { setRRSSLinks } from '../modules/rrss';
import { setFixedIframeUrl } from './chart_helpers';

//Colores fijos
const COLOR_PRIMARY_1 = '#F8B05C', 
COLOR_PRIMARY_2 = '#E37A42',
COLOR_COMP_1 = '#528FAD', 
COLOR_COMP_2 = '#AADCE0',
COLOR_GREY_1 = '#D6D6D6', 
COLOR_GREY_2 = '#A3A3A3',
COLOR_ANAG__PRIM_1 = '#BA9D5F', 
COLOR_ANAG_PRIM_2 = '#9E6C51',
COLOR_ANAG_PRIM_3 = '#9E3515',
COLOR_ANAG_COMP_1 = '#1C5A5E';

export function initChart(iframe) {
    //Desarrollo del gráfico
    d3.json('https://raw.githubusercontent.com/CarlosMunozDiazCSIC/informe_perfil_mayores_2022_social_4_4/main/data/json_sankey_quien_cuida_a_quien.json', function(error,data) {
        if (error) throw error;

        let margin = {top: 0, right: 0, bottom: 0, left: 0},
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
            .attr("stroke-opacity", 0.2)
            .selectAll("path");

        let node = svg.append("g")
            .attr("class", "nodes")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("g");

        let graph = sankey(data);

        let color = d3.scaleOrdinal()
            .domain(['Hombres < 65','Hombres 65+','Mujeres < 65','Mujeres 65+'])
            .range([COLOR_PRIMARY_1, COLOR_COMP_2, COLOR_COMP_1, COLOR_OTHER_1]);

        function init() {
            link = link
                .data(data.links)
                .enter()
                .append("path")
                .attr("d", d3.sankeyLinkHorizontal())
                .attr("stroke-width", function(d) { return Math.max(1, d.width); });

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

            node.append("text")            
                .attr('class','sankey-text')
                .attr("x", function(d) { return d.x0 - 6; })
                .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .text(function(d) { return d.name + ' (' + d.value + ')'; })
                .filter(function(d) { return d.x0 < width / 2; })
                .attr("x", function(d) { return d.x1 + 6; })
                .attr("text-anchor", "start");

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