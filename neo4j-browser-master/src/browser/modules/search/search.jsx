
import React, { Component } from 'react'
import { Row, Col, Input, Button, Dropdown, Menu ,message , Tag } from 'antd';
import { mapRelationships, mapNodes, getGraphStats } from '../D3Visualization/mapper';
import axios from "axios";
axios.defaults.baseURL = 'http://xorder.live:22222';
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
            m3: [],
            select1 : '',
            select2 : '',
            select3 : ''
        };
    }
    componentDidMount() {
        axios.get('/neo4j_browser/getRelationNames').then(obj => {
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
    // 192.168.0.40:22222
    // xorder.live:22222
    onChange1 = e => {
        let keyword = e.target.value;
        this.setState({
            v1: keyword,
            select1 : ''
        })
        if(!keyword || !keyword.trim()){
            return;
        }
        n1++;
        axios.defaults.headers.common['n1'] = n1;
        axios.get(`/neo4j_browser/getNodesByName?keyword=${keyword}`).then(obj => {
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
        let value = e.target.value;
        this.setState({
            v2 : value,
            select2 : ''
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
        let keyword = e.target.value;
        this.setState({
            v3: keyword,
            select3 : ''
        })
        if(!keyword || !keyword.trim()){
            return;
        }
        n3++;
        axios.defaults.headers.common['n3'] = n3;
        axios.get(`/neo4j_browser/getNodesByName?keyword=${keyword}`).then(obj => {
            let n = obj.config.headers.n3;
            if (n == n3) {
                this.setState({
                    m3: obj.data.result
                })
            }
        })
    }
    isSelect(type){
        let {select1,select2,m1,m3,m2,select3} = this.state;
        if(!select1 && !select2 && !select3){
            let name =  type == '2' ? this.state['m'+type][0] : this.state['m'+type][0].name;
            let value = this.state['m'+type][0];
            this.setState({
                ['v'+type] : name,
                ['select' + type] : value
            })
        }
    }
    selectValue(obj) {
        let name = obj.key == '2' ? obj.value : obj.value.name;
        this.setState({
            ['v'+obj.key] : name,
            ['select'+obj.key] : obj.value
        })
    }
    search =  () =>{
        let {select1,select2,select3} = this.state;
        if((!select2  || !select2.trim() ) && (!select1 || !select1.trim()) && (!select3 || !select3.trim())){
            message.info('什么也没查到，换个关键词试试？');
            return;

        }
        // console.log(info);
        let ids = info.graph._nodes.map((v)=>{
            return v.id;
        })
        const { graph, graphView } = info;
        axios.post('/neo4j_browser/applyNodeQuery',{node1 : select1.id , node2 : select3.id , relation : select2}).then(obj=>{
            let result = obj.data.results;
            if(result.length > 0 ){
                let nodes = [], relationships = [];
                if(result[0].data.length > 0){
                    result[0].data.forEach(v => {
                        nodes = nodes.concat(v.graph.nodes); 
                    });     
                    let newNodes  = [];
                    nodes = nodes.filter(v=>{
                        let is = newNodes.indexOf(v.id);
                        if(is == -1){
                            newNodes.push(v.id);
                            return true
                        }else{
                            return false;
                        }
                    })
                    axios.post('/neo4j_browser/applyRelationQuery',{existingNodes : ids.concat(newNodes) , newNodes}).then(obj1=>{
                        let result1 = obj1.data.results;
                        if(result1.length > 0 ){
                            if(result1[0].data.length > 0){
                                result1[0].data.forEach(v => {
                                    relationships = relationships.concat(v.graph.relationships);   
                                });  
                                // 之前没有生成成功是因为没有设置startNodeId 和 endNodeId
                                relationships.forEach(v=>{
                                    v.startNodeId = v.startNode;
                                    v.endNodeId = v.endNode;
                                })
                            }
                        }
                        graph.addNodes(mapNodes(nodes));
                        if(relationships.length > 0 ){
                            graph.addRelationships(mapRelationships(relationships, graph))
                        }
                        graphView.update()
                        this.graphModelChanged()
                    })

                }else{
                    message.info('未检索到任何结果');
                }
            }else{
                message.info('未检索到任何结果');
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
                                        <Menu.Item key={i}  onClick={this.selectValue.bind(this, { key: '1', value: v })}>
                                            {v.name}&nbsp;&nbsp;&nbsp;&nbsp;
                                                <span>
                                                    {
                                                        v.labels.map((v1,i1)=>{
                                                            return  <Tag key={v.id + '-' + i1} style={{marginLeft:3}} color="#2db7f5">{v1}</Tag>
                                                        })
                                                    }
                                                </span>
                                        </Menu.Item>)
                                }) || '无数据'
                            }
                        </Menu>
                    }>
                        <Input
                            onChange={this.onChange1}
                            onBlur={this.isSelect.bind(this,'1')} 
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
                                        <Menu.Item key={i} onClick={this.selectValue.bind(this, { key: '2', value: v })}>
                                            {v}
                                        </Menu.Item>)
                                }) || '无数据'
                            }
                        </Menu>}>
                        <Input
                            onChange={this.onChange2}
                            onBlur={this.isSelect.bind(this,'2')} 
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
                                        <Menu.Item key={i}   onClick={this.selectValue.bind(this, { key: '3', value: v })}>
                                            {v.name}&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span>
                                                    {
                                                        v.labels.map((v1,i1)=>{
                                                            return  <Tag key={v.id + '-' + i1} style={{marginLeft:3}} color="#2db7f5">{v1}</Tag>
                                                        })
                                                    }
                                                </span>
                                        </Menu.Item>)
                                }) || '无数据'
                            }
                        </Menu>}>
                        <Input
                            onChange={this.onChange3}
                            onBlur={this.isSelect.bind(this,'3')} 
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