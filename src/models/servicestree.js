import request from '../utils/request'
import { effects } from 'redux-saga';

export default {
    namespace: "servicestree",
    state: {
        infolist: [],
        branchidlist: [] 
    },
    reducers: {
        updateData(state, { payload }) {
            return {
                ...state,
                infolist: payload,
            }
        },
        updateBranch(state, { payload }) {
            return {
                ...state,
                branchidlist: payload,
            }
        }
    },
    effects: {
        *getData(_, { call, put }) {
            const response = yield call(request, {
                url: 'https://git.njuics.cn/api/v4/groups/typhoon/projects',
                options: {
                    headers: {
                        'Private-Token': 'hJMKkXgcTniyzWP_Prjo',
                        'content-type': 'application/json'
                    }
                }
            });
            // console.log(response)
            yield put({
                type: 'updateData', payload: response.map((value) =>{
                    return {
                        url: value.http_url_to_repo,
                        name: value.name
                    }
                })
            })
        },

        *getBranch({payload}, { call, put, }) {
            // console.log(payload)
            const response = yield call(request, {
                url: 'https://git.njuics.cn/api/v4/projects/typhoon%2F'+payload[0]+'/repository/commits',
                options: {
                    headers: {
                        'Private-Token': 'hJMKkXgcTniyzWP_Prjo',
                        'content-type': 'application/json'
                    }
                }
            });
            // console.log(response)
            yield put({
                type: 'updateBranch', payload: response.map((value) =>{
                    return {
                        id: value.id,
                        title: value.title,
                        createtime: value.created_at,
                        parent_id:value.parent_ids,
                        name: payload[0]
                    }
                })
            })
        },
        *execute({payload}, { call, put}) {
            console.log(payload)
            console.log(payload.id)
            console.log(payload.title)       
            const response = yield call(request, {
                // url: '/api/repos/wdongyu/git-test/builds?branch='+payload[0]+'&commit='+payload[1],
                url: '/api/repos/typhoon/'+payload.name+'/builds?branch=master&commit='+payload.id,
                options:{
                    headers: {
                        'Authorization': 'Bearer jK72ueqbrjm2TlADbYeZXTngd1UALBGY',
                        'content-type': 'application/json'
                    },
                    method: "POST"
                }
            });
        }
    }
}
