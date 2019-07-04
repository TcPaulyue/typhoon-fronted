import request from '../utils/request'

const DataClean = (services) => {
    const nodeMap = new Map()
    const parentMap = new Map()
    debugger
    const edges = services.elements.edges
    const dirtyNodes = services.elements.nodes
    const nodes = dirtyNodes.filter((item) => !item.data.isUnused)
    const serviceGraph =  {
        nodes: nodes,
        edges: edges
    }
    console.log(serviceGraph)
    debugger
    const elements = []
    serviceGraph.nodes.map((item) => {
        if (item.data.nodeType === 'service') {
            nodeMap.set(item.data.service, item.data.id)
        }
    })
    serviceGraph.nodes.map((item) => {
        if (item.data.nodeType === 'service') {
            elements.push({
                group: 'nodes',
                data: {
                    id: item.data.id
                }
            })
        }
        else if (item.data.nodeType === 'app') {
            const parentId = nodeMap.get(item.data.app)
            elements.push(parentId === undefined ? {
                group: 'nodes',
                data: {
                    id: item.data.id
                }
            } : {
                    group: 'nodes',
                    data: {
                        id: item.data.id,
                        parent: parentId
                    }
                })
            if (parentId !== undefined) {
                parentMap.set(item.data.id, parentId)
            }
        }
    })
    serviceGraph.edges.map((item) => {
        const sourceParent = parentMap.get(item.data.source)
        const targetParent = parentMap.get(item.data.target)
        if(sourceParent===item.data.target||targetParent===item.data.source){
            return
        }
        elements.push({
            group: 'edges',
            data: item.data
        })
    })
    console.log(elements)
    debugger
    return elements
}


export default {
    namespace: 'servicegraph',
    state: {
        elements: []
    },
    reducers:{
        updateElements(state,{payload}){
            return {
                ...state,
                elements: payload
            }
        }
    },
    effects:{
        *fetchGraphData(_,{call,put}){
            const response = yield call(request,{
                url: '/services',
                options: {
                    headers: {
                        'Private-Token': 'hJMKkXgcTniyzWP_Prjo',
                        'content-type': 'application/json'
                    }
                }
            })
            const elements = DataClean(response)
            debugger
            yield put({type: 'updateElements',payload: elements})
        }
    }
}