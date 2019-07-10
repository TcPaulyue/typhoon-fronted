import request from '../utils/request'
import { effects } from 'redux-saga';
import { delay } from 'dva/saga';

export default {
    namespace: "servicetree",
    state: {
        branchNodeList: [],
        serviceList: [],
        clickedBranchNodeInfo: ''
    },
    reducers: {
        updateServiceList(state, { payload }) {
            return {
                ...state,
                serviceList: payload,
            }
        },

        updateBranch(state, { payload }) {
            return {
                ...state,
                branchNodeList: payload,
            }
        },

        updateBranchNodeCommitNumber(state, { payload }) {
            console.log(payload)
            return {
                ...state,
                branchNodeList: state.branchNodeList.map((branchNode) => {
                    if (branchNode.id === payload.id) {
                        branchNode = {
                            ...branchNode,
                            commitnumber: payload.commitnumber,
                        }
                    }
                    return branchNode
                }),
                clickedBranchNodeInfo: {
                    id: payload.id,
                    commitnumber: payload.commitnumber,
                    name: payload.name
                }
            }
        },

        updateBranchNodeStatus(state, { payload }) {
            //console.log(payload.detailedstatus.clone)
            return {
                ...state,
                branchNodeList: state.branchNodeList.map((branchNode) => {
                    if (branchNode.id === payload.id) {
                        branchNode = {
                            ...branchNode,
                            status: payload.status,
                            detailedstatus: payload.detailedstatus
                        }
                        if (branchNode.status === 'running') {
                            branchNode = {
                                ...branchNode,
                                iconType: "loading",
                                badgestatus: "processing"
                            }
                        }
                        else if (branchNode.status === 'failure') {
                            branchNode = {
                                ...branchNode,
                                iconType: "close-circle",
                                badgestatus: "error"
                            }
                        }
                        else if (branchNode.status === 'success') {
                            branchNode = {
                                ...branchNode,
                                iconType: "check-circle",
                                badgestatus: "success"
                            }
                        }
                    }
                    return branchNode
                })
            }
        }

    },
    
    effects: {
        *getServiceList(_, { call, put }) {
            const response = yield call(request, {
                url: 'https://git.njuics.cn/api/v4/groups/typhoon/projects',
                options: {
                    headers: {
                        'Private-Token': 'hJMKkXgcTniyzWP_Prjo',
                        'content-type': 'application/json'
                    }
                }
            });
            yield put({
                type: 'updateServiceList', payload: response.map((value) => {
                    return {
                        url: value.http_url_to_repo,
                        serviceName: value.name
                    }
                })
            })
        },

        *getBranch({ payload }, { call, put, }) {
            //console.log(payload)
            const response = yield call(request, {
                url: 'https://git.njuics.cn/api/v4/projects/typhoon%2F' + payload[0] + '/repository/commits',
                options: {
                    headers: {
                        'Private-Token': 'hJMKkXgcTniyzWP_Prjo',
                        'content-type': 'application/json'
                    }
                }
            });
            yield put({
                type: 'updateBranch', payload: response.map((value) => {
                    return {
                        id: value.id,
                        short_id: value.short_id,
                        title: value.title,
                        createtime: value.created_at,
                        parent_id: value.parent_ids,
                        name: payload[0],
                        iconType: "setting",
                        status: "pending",
                        badgestatus: "default",
                        detailedstatus: null,
                        commitnumber: "1"
                    }
                })
            })
        },

        *executeDrone({ payload }, { call, put }) {
            //console.log(payload)
            const response = yield call(request, {
                // url: '/api/repos/wdongyu/git-test/builds?branch='+payload[0]+'&commit='+payload[1],
                url: '/api/repos/typhoon/' + payload.name + '/builds?branch=master&commit=' + payload.id,
                options: {
                    headers: {
                        'Authorization': 'Bearer jK72ueqbrjm2TlADbYeZXTngd1UALBGY',
                        'content-type': 'application/json'
                    },
                    method: "POST"
                }
            });
            //console.log(response)
            yield put({
                type: 'updateBranchNodeCommitNumber',
                payload: {
                    id: payload.id,
                    name: payload.name,
                    commitnumber: response.number
                }
            })
        },

        *getBranchNodeStatus({ payload }, { call, put }) {
            while (1) {
                const response = yield call(request, {
                    url: '/api/repos/typhoon/' + payload.name + '/builds/' + payload.commitnumber,
                    options: {
                        headers: {
                            'Authorization': 'Bearer jK72ueqbrjm2TlADbYeZXTngd1UALBGY',
                            'content-type': 'application/json'
                        }
                    }
                });
                console.log(response)
                yield put({
                    type: 'updateBranchNodeStatus',
                    payload: {
                        id: payload.id,
                        status: response.status,
                        detailedstatus: {
                            // {branchNodeInfo.detailedstatus !== null ? branchNodeInfo.detailedstatus.clone : "NULL"}<br />
                            clone:  response.stages[0].steps[0].status,
                            publish: response.stages[0].steps[1].status,
                            deploy: response.stages[0].steps[2].status 
                        }
                    }
                })
                yield call(delay, 5000)
            }
        },
    }
}