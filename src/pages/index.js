import React, { Component } from 'react';
import { Icon, Tree, Timeline, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import CustomButton from '../components/CustomButton'
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
cytoscape.use(coseBilkent);

const { TreeNode } = Tree;


// const DataClean = (services) => {
//     const edges = services.elements.edges
//     const dirtyNodes = services.elements.nodes
//     const nodes = dirtyNodes.filter((item) => !item.data.isUnused)
//     return {
//         nodes: nodes,
//         edges: edges
//     }
// }

// const GenerateElements = (servicesGraph) => {
//     const elements = []
//     servicesGraph.nodes.map((item) => {
//         if (item.data.nodeType === 'service') {
//             nodeMap.set(item.data.service, item.data.id)
//         }
//     })
//     servicesGraph.nodes.map((item) => {
//         if (item.data.nodeType === 'service') {
//             elements.push({
//                 group: 'nodes',
//                 data: {
//                     id: item.data.id
//                 }
//             })
//         }
//         else if (item.data.nodeType === 'app') {
//             const parentId = nodeMap.get(item.data.app)
//             elements.push(parentId === undefined ? {
//                 group: 'nodes',
//                 data: {
//                     id: item.data.id
//                 }
//             } : {
//                     group: 'nodes',
//                     data: {
//                         id: item.data.id,
//                         parent: parentId
//                     }
//                 })
//             if (parentId !== undefined) {
//                 parentMap.set(item.data.id, parentId)
//             }
//         }
//     })
//     servicesGraph.edges.map((item) => {
//         elements.push({
//             group: 'edges',
//             data: item.data
//         })
//     })
//     return elements
// }

// const EdgeClean = (elements) => {
//     return elements.filter((item)=>{
//         if(item.group==='edges'){
//             const sourceParent = parentMap.get(item.data.source)
//             const targetParent = parentMap.get(item.data.target)
//             debugger
//             if(sourceParent===item.data.target||targetParent===item.data.source){
//                 return false
//             }
//         }
//         return true
//     })
// }

// const getElements = (services) => {
//     const serviceGraph = DataClean(services)
//     const dirtyElements = GenerateElements(serviceGraph)
//     const elements  = EdgeClean(dirtyElements)
//     console.log(elements)
//     return elements
// }

class tree extends Component {
    constructor(props) { //构造函数
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

    onTreeNodeSelect = (keys, e) => {
        this.props.dispatch({
            type: "servicestree/getBranch", payload: keys
        })
    }

    onBranchSelect = (keys) => {
        this.props.dispatch({
            type: "servicestree/execute", payload: keys
        })
    }

    renderCytoscapeElement() {
        debugger
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
                            'background-color': '#66ccff'
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
                            'width': 3,
                            'line-color': '#66ccff',
                            'target-arrow-shape': 'triangle',
                        }
                    }
                ],
                elements: this.props.serviceGraph.elements
                // elements: [{ group: 'nodes', data: { id: 'n10', parent: 'n38' } },
                // { group: 'nodes', data: { id: 'n11', parent: 'n38' } },
                // { group: 'nodes', data: { id: 'n38' } },
                // { group: 'nodes', data: { id: 'n40' } },
                // { group: 'nodes', data: { id: 'n44', parent: 'n38' } },
                // { group: 'nodes', data: { id: 'n45', parent: 'n40' } },
                // { group: 'nodes', data: { id: 'n46', parent: 'n40' } },
                // { group: 'edges', data: { id: 'e0', source: 'n10', target: 'n46' } },
                // { group: 'edges', data: { id: 'e1', source: 'n38', target: 'n40' } },
                // ]
            });
    }

    componentWillMount() {
        debugger
        this.props.dispatch({
            type: "servicestree/getData",
        });
        this.props.dispatch({
            type: "servicegraph/fetchGraphData",
        })
        // this.getCommits()
    }

    componentDidMount() {
        this.renderCytoscapeElement();
    }

    componentWillUpdate(){
        this.cy.unmount();
        this.renderCytoscapeElement();
    }

    render() {
        let cyStyle = {
            height: '550px',
            width: '300px',
            margin: '20px 0px'
        };

        const treenodeList = this.props.infolist.map((value) => {
            return (
                <TreeNode
                    icon={<Icon type="code" theme="twoTone" />}

                    title={value.name}
                    key={value.name} />
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
                    {treenodeList}
                </TreeNode>
            </Tree>
        );


        this.props.branchidlist.reverse()

        // var gitTree = null

        // if (this.props.branchidlist[0]) {
        //     gitTree = (
        //         <Gitgraph>
        //             {(gitgraph) => {
        //                 const master = gitgraph.branch(this.props.branchidlist[0].id);
        //                 for (var i = 1; i < this.props.branchidlist.length; i++) {
        //                     {
        //                         master.commit(this.props.branchidlist[i].title)
        //                     }
        //                 }
        //             }}
        //         </Gitgraph>
        //     )
        // }

        const branchList = this.props.branchidlist.map((value) => {
            return (
                <Timeline.Item
                    dot={
                        <CustomButton
                            buttonValue={value}
                            buttonClicked={(e, value) => {
                                this.onBranchSelect(value)
                            }}>
                            <Icon
                                type="check-circle"
                                theme="twoTone"
                                twoToneColor="#52c41a"
                                style={{ fontSize: '20px' }}
                            />

                        </CustomButton>
                    }>
                    id: {value.id}<br />
                    parent_id: {value.parent_id}<br />
                    title: {value.title}<br />
                    create_time:{value.createtime}
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
                            {branchList}
                        </Timeline>
                    </Col>
                </Row>
            </div>

        )

    }
}
export default connect((state) => {
    return {
        ...state.servicestree,
        serviceGraph: state.servicegraph
    }
})(tree);
