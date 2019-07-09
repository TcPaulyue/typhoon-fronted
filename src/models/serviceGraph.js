import request from '../utils/request'
import { delay } from 'dva/saga';
// import services from './serviceData.json'
const DataClean = (services) => {
    const nodeMap = new Map()
    const parentMap = new Map()
    debugger
    const edges = services.elements.edges
    const dirtyNodes = services.elements.nodes
    const nodes = dirtyNodes.filter((item) => !item.data.isUnused)
    const serviceGraph = {
        nodes: nodes,
        edges: edges
    }
    console.log(serviceGraph)
    debugger
    const elements = []
    serviceGraph.nodes.map((item) => {
        if (item.data.nodeType === 'service') {
            nodeMap.set(item.data.service, item.data.service)
            elements.push({
                group: 'nodes',
                data: {
                    id: item.data.service,
                }
            })
        }
    })
    serviceGraph.nodes.map((item) => {
        if (item.data.isRoot === true) {
            elements.push({
                group: 'nodes',
                data: {
                    id: item.data.id,
                    type: 'ellipse',
                    name: 'Root'
                }
            })
        }
        if (item.data.nodeType === 'service') {
            const parentId = nodeMap.get(item.data.service)
            elements.push({
                group: 'nodes',
                data: {
                    id: item.data.id,
                    parent: parentId,
                    name: item.data.service,
                    type: 'triangle'
                }
            })
        }
        else if (item.data.nodeType === 'app') {
            const parentId = nodeMap.get(item.data.app)
            elements.push(parentId === undefined ? {
                group: 'nodes',
                data: {
                    id: item.data.id,
                    name: item.data.workload,
                    type: 'rectangle',
                    name: item.data.workload
                }
            } : {
                    group: 'nodes',
                    data: {
                        id: item.data.id,
                        parent: parentId,
                        type: 'rectangle',
                        name: item.data.workload
                    }
                })
            if (parentId !== undefined) {
                parentMap.set(item.data.id, parentId)
            }
        }
    })
    serviceGraph.edges.map((item) => {
        elements.push({
            group: 'edges',
            data: item.data
        })
    })
    console.log(elements)
    return elements
}


export default {
    namespace: 'servicegraph',
    state: {
        elements: []
    },
    reducers: {
        updateElements(state, { payload }) {
            return {
                ...state,
                elements: payload
            }
        }
    },
    effects: {
        *fetchGraphData(_, { call, put }) {
            let authString = 'admin:admin'
            let headers = new Headers()
            headers.set('Authorization', 'Basic ' + btoa(authString))
            while (true) {
                const response = yield call(request, {
                    url: '/kiali/api/namespaces/graph?edges=requestsPercentage&graphType=versionedApp&namespaces=typhoon&injectServiceNodes=true&duration=60s&pi=15000&layout=dagre',
                    options: {
                        headers: headers
                    }
                })
                console.log(elements)
                const elements = DataClean(response)
                debugger
                yield put({ type: 'updateElements', payload: elements })
                yield call(delay,3000)
            }
        }
    }
}