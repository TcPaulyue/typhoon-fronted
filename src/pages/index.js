import React, { Component } from 'react';
import { Icon, Tree, Timeline, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import CustomButton from '../components/CustomButton';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
cytoscape.use(coseBilkent);

const { TreeNode } = Tree;

class tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // mytext: '',
      treedivStyle: {
        position: 'absolute',
        //right: 0,
        bottom: 0
      },
      branchdivStyle: {
        position: 'absolute',
        right: 0,
        bottom: 0
      }
    }
    this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this);
  }

  renderCytoscapeElement() {
    this.cy = cytoscape(
      {
        container: document.getElementById('cy'),

        layout: {
          name: 'cose-bilkent',
          animate: false
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
              'line-color': '#61bffc',
              'target-arrow-color': '#61bffc'
            }
          }
        ],
        elements: this.props.serviceGraph.elements
      });
  }


  onTreeNodeSelect = (keys, e) => {
    this.props.dispatch({
      type: "servicetree/getBranch", payload: keys
    })
  }

  onBranchNodeSelect = (selectedName, selectedId) => {
    this.props.dispatch({
      type: "servicetree/executeDrone", payload: {
        id: selectedId,
        name: selectedName
      }
    })
  }

  onBranchNodeStatus = (keys) => {
    this.props.dispatch({
      type: "servicetree/getBranchNodeStatus", payload: keys
    })
  }


  componentWillMount() {
    // debugger
    this.props.dispatch({
      type: "servicetree/getServiceList",
    });
    this.props.dispatch({
      type: "servicegraph/fetchGraphData",
    })
    // this.getCommits()
  }

  componentDidMount() {
    this.renderCytoscapeElement();
  }


  componentWillUpdate() {
    this.cy.unmount();
    this.renderCytoscapeElement();
  }


  componentDidUpdate(prevProps) {
    console.log(prevProps.clickedBranchNodeInfo)
    console.log(this.props.clickedBranchNodeInfo)
      if(this.props.clickedBranchNodeInfo.id !== prevProps.clickedBranchNodeInfo.id){
        this.onBranchNodeStatus(this.props.clickedBranchNodeInfo)
      }
  }
  render() {
    let cyStyle = {
      height: '550px',
      width: '300px',
      margin: '20px 0px'
    };

    const serviceNodeList = this.props.serviceList.map((serviceNode) => {
      return (
        <TreeNode
          icon={<Icon type="code" theme="twoTone" />}
          title={serviceNode.serviceName}
          key={serviceNode.serviceName} />
      )
    })

    const microservicesTree = (
      <Tree
        showIcon
        defaultExpandAll
        defaultSelectedKeys={['0-0-0']}
        switcherIcon={<Icon type="down" />}
        onSelect={this.onTreeNodeSelect}
      >
        <TreeNode icon={<Icon type="folder" theme="twoTone" />}
          title="microservices" key="0-0" >
          {serviceNodeList}
        </TreeNode>
      </Tree>
    );


    const branchNodeListDisplay = this.props.branchNodeList.map((branchNodeInfo) => {
      return (
        <Timeline.Item key={branchNodeInfo.id}
          dot={
            <CustomButton
              clickId={branchNodeInfo.id}
              clickName={branchNodeInfo.name}
              buttonClicked={(e, id, name) => {
                this.onBranchNodeSelect(id, name)
              //   if(this.props.mark === 'false'){
              //     console.log(this.props.branchNodeList)
              //   this.props.branchNodeList.forEach((branchNode) => {
              //     if (branchNode.id===name) {
              //       this.onBranchNodeStatus(branchNode)
              //     }
              //   })
              // }
              }}>
              <Icon
                type={branchNodeInfo.iconType}
                theme="twoTone"
                twoToneColor="#52c41a"
                style={{ fontSize: '20px' }}
              />
            </CustomButton>
          }
        >
          id: {branchNodeInfo.id}<br />
          create_time:{branchNodeInfo.createtime}<br />
          status: {branchNodeInfo.status}
        </Timeline.Item>
      )
    })


    return (
      <div>
        <Row type="flex">
          <Col span={8} order={1}>
            {microservicesTree}
          </Col>

          <Col span={8} order={2}>
            <div className="container">
              <div className="node_selected">
                <div style={cyStyle} id="cy" />
              </div>
            </div>
          </Col>

          <Col span={8} order={3}>
            <Timeline>
              {branchNodeListDisplay}
            </Timeline>
          </Col>
        </Row>
      </div>

    )
  }
}

export default connect((state) => {
  return {
    ...state.servicetree,
    serviceGraph: state.servicegraph
  }
})(tree);