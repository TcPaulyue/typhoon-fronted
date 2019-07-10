import { Component } from 'react'
import cola from 'cytoscape-cola'
import cytoscape from 'cytoscape'
import styles from './index.css'
cytoscape.use(cola);
export default class TestPage extends Component {
  constructor(props) {
    super(props)
    this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this);
  }

  renderCytoscapeElement() {
    this.cy = cytoscape(
      {
        container: document.getElementById('cy'),

        layout: {
          name: 'cola',
          animate: true,
          randomize: false
        },
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#66ccff',
              'shape': 'data(type)',
              'label': 'data(name)'
            }
          },
          {
            selector: ':parent',
            style: {
              'background-opacity': 0.333
            }
          },
          {
            selector: 'edge',
            style: {
              'curve-style': 'bezier',
              'width': 3,
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#61bffc',
              'line-color': '#61bffc',
              'line-dash-pattern': [3,6],
              'line-dash-offset': '24'
            }
          }
        ],
        elements: {
          nodes: [
            { data: { id: 'a' } },
            { data: { id: 'b' } }
          ],
          edges: [
            { data: { id: 'ab', source: 'a', target: 'b' } }
          ]
        }
      });
      this.cy.edges().animate({
        style: {
          'curve-style': 'bezier',
          'width': 3,
          'target-arrow-shape': 'triangle',
          'target-arrow-color': '#33bffc',
          'line-color': '#33bffc',
          'line-dash-pattern': [3,6],
          'line-dash-offset': '24'
        }
      },{
        duration: 5000
      })
  }

  componentDidMount() {
    this.renderCytoscapeElement();
    // setInterval(function () {
    //   console.log(this.props)
    //   this.onBranchNodeStatus(this.props.clickedBranchNodeInfo)
    // }, 1000)
  }

  render() {
    let cyStyle = {
      height: '550px',
      width: '900px',
      margin: '20px 0px'
    };
    return <div className="container">
      <div style={{width:20,height:5,background: 'repeating-linear-gradient(to right, transparent, transparent 3px, #000 3px, #000 8px)'}}/>
      <div className="node_selected">
        <div style={cyStyle} id="cy" />
      </div>
    </div>
  }
}