
import React, { Component } from 'react'
import { Row, Form, Col, Input, Button, Dropdown, Menu ,message } from 'antd';
import { mapRelationships, mapNodes, getGraphStats } from '../D3Visualization/mapper';
import axios from "axios";



let n1 = 0, n3 = 0;
let info = {};
export class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: {},
            m1: [],
            v1: '',
            v2: '',
            v3: '',
            m2: [],
            allM2: [],
            m3: []
        };
    }
    componentDidMount() {
        axios.get('http://xorder.live:22222/neo4j_browser/getRelationNames').then(obj => {
            this.setState({
                allM2: obj.data.result,
                m2: obj.data.result
            })
        })
    }
    componentDidUpdate() {
        // if(this.props.GraphEventHandler){
        //     this.setState({
        //         info : this.props.GraphEventHandler
        //     })
        // }
        if (this.props.GraphEventHandler) {
            info = this.props.GraphEventHandler;
        }
    }

    graphModelChanged() {
        info.onGraphModelChange(getGraphStats(info.graph))
    }
    handleSubmit = e => {
        e.preventDefault();
        // console.log(info);
        const { graph, graphView } = info;
        // const graphModelChanged = this.graphModelChanged.bind(this)
        let relationships = [
            {
                endNodeId: "1094135",
                id: "1776406",
                properties: {
                    source: 'icomarks',
                    position: 'Chief Technical Officer , Co-founder 34 age'
                },
                startNodeId: '1173162',
                type: "PERSON_POSITION"
            }
        ]
        let nodes = [
            {
                id: '1173162',
                labels: ['Person', 'Icomarks'],
                properties: {
                    icomarks_url: ['/ico/social', '/ico/nexus'],
                    name: 'Sociall',
                    updatedAt: ['1564305176.0', '1564306086.0']
                }
            }
        ]
        // graph.addExpandedNodes(d, mapNodes(nodes))
        graph.addNodes(mapNodes(nodes));
        graph.addRelationships(mapRelationships(relationships, graph))
        graphView.update()
        this.graphModelChanged()
    };
    onChange1 = e => {
        let keyword = e.target.value.trim();
        this.setState({
            v1: keyword
        })
        if(!keyword){
            return;
        }
        n1++;
        axios.defaults.headers.common['n1'] = n1;
        axios.get(`http://xorder.live:22222/neo4j_browser/getNodesByName?keyword=${keyword}`).then(obj => {
            let n = obj.config.headers.n1;
            console.log(n,n1)
            if (n == n1) {
                this.setState({
                    m1: obj.data.result
                })
            }
        })

    }
    onChange2 = e => {
        let value = e.target.value.trim();
        this.setState({
            v2 : value
        })
        if(!value){
            return;
        }
        let reg = new RegExp(value, 'gim');
        let arr = this.state.allM2.filter((v) => {
            return reg.test(v);
        });
        this.setState({
            m2: arr
        })
    }
    onChange3 = e => {
        let keyword = e.target.value.trim();
        this.setState({
            v3: keyword
        })
        if(!keyword){
            return;
        }
        n3++;
        axios.defaults.headers.common['n3'] = n3;
        axios.get(`http://xorder.live:22222/neo4j_browser/getNodesByName?keyword=${keyword}`).then(obj => {
            let n = obj.config.headers.n3;
            if (n == n3) {
                this.setState({
                    m3: obj.data.result
                })
            }
        })
    }
    selectValue(obj) {
        this.setState({
            [obj.key]: obj.value
        })
    }
    search =  () =>{
        let {v1,v2,v3} = this.state;
        if(!v1 && !v2 && !v3){
            message.error('不能全为空');
            return;
        }
        // console.log(info);
        let ids = info.graph._nodes.map((v)=>{
            return v.id;
        })
        const { graph, graphView } = info;
        axios.post('http://xorder.live:22222/neo4j_browser/getPathsByDegree',{node1 : v1 , node2 : v3 ,existingNodes : ids , relation : v2}).then(obj=>{
            console.log(obj);
            let result = obj.data.results;
            if(result.length > 0 ){
                let nodes = [], relationships = [];
                if(result[0].data.length > 0){
                    result[0].data.forEach(v => {
                        nodes = nodes.concat(v.graph.nodes);
                        relationships = relationships.concat(v.graph.relationships);   
                    });     
                    let arr  = [];
                    nodes = nodes.filter(v=>{
                        let is = arr.indexOf(v.id);
                        if(is == -1){
                            arr.push(v.id);
                            return true
                        }else{
                            return false;
                        }
                    })
                    // 之前没有生成成功是因为没有设置startNodeId 和 endNodeId
                    relationships.forEach(v=>{
                        v.startNodeId = v.startNode;
                        v.endNodeId = v.endNode;
                    })
                    graph.addNodes(mapNodes(nodes));
                    graph.addRelationships(mapRelationships(relationships, graph))
                    graphView.update()
                    this.graphModelChanged()
                }
            }

        })
    }


    render() {
        const { m1, m2, m3, v1, v2, v3 } = this.state;
        return (
            <Row>
                <Col span={5} offset={3}>
                    <Dropdown  overlayStyle={{maxHeight : 400 , overflowY : 'scroll'}}  overlay={
                        <Menu>
                            {m1.length == 0 ? <Menu.Item>暂无数据</Menu.Item> :
                                m1.map((v, i) => {
                                    return (
                                        <Menu.Item key={i} onClick={this.selectValue.bind(this, { key: 'v1', value: v })}>
                                            {v}
                                        </Menu.Item>)
                                }) || '无数据'
                            }
                        </Menu>
                    }>
                        <Input
                            onChange={this.onChange1}
                            value={v1}
                            placeholder="节点1"
                        />
                    </Dropdown></Col>
                <Col span={5} offset={1}>
                    <Dropdown overlayStyle={{maxHeight : 400 , overflowY : 'scroll'}} overlay={
                        <Menu>
                            {m2.length == 0 ? <Menu.Item>暂无数据</Menu.Item> :
                                m2.map((v, i) => {
                                    return (
                                        <Menu.Item key={i} onClick={this.selectValue.bind(this, { key: 'v2', value: v })}>
                                            {v}
                                        </Menu.Item>)
                                }) || '无数据'
                            }
                        </Menu>}>
                        <Input
                            onChange={this.onChange2}
                            value={v2}
                            placeholder="关系"
                        />
                    </Dropdown>
                </Col>
                <Col span={5} offset={1}>
                    <Dropdown overlayStyle={{maxHeight : 400 , overflowY : 'scroll'}} overlay={
                        <Menu>
                            {m3.length == 0 ? <Menu.Item>暂无数据</Menu.Item> :
                                m3.map((v, i) => {
                                    return (
                                        <Menu.Item key={i} onClick={this.selectValue.bind(this, { key: 'v3', value: v })}>
                                            {v}
                                        </Menu.Item>)
                                }) || '无数据'
                            }
                        </Menu>}>
                        <Input
                            onChange={this.onChange3}
                            value={v3}
                            placeholder="节点2"
                        />
                    </Dropdown>
                </Col>
                <Col span={1}  offset={2}>
                    <Button type="primary" onClick={this.search}>
                        搜索
          </Button>
                </Col>

            </Row>
        )
    }
}



export default Search;