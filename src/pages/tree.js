import React, { Component } from 'react';
import { Icon, Tree, Timeline, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import CustomButton from '../components/CustomButton'

const { TreeNode } = Tree;

const { Gitgraph } = require("@gitgraph/react");

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

    componentWillMount() {
        this.props.dispatch({
            type: "servicestree/getData",
        });
        // this.getCommits()
    }

    render() {
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
                        {/* {gitTree} */}
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
export default connect((state) => { return state.servicestree })(tree);
