/*
 * Copyright (c) 2002-2019 "Neo4j,"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { mapNodes, mapRelationships, getGraphStats } from './mapper'
import {message} from 'antd';

// TODO
export class GraphEventHandler {
  constructor (
    graph,
    graphView,
    getNodeNeighbours,
    onItemMouseOver,
    onItemSelected,
    onGraphModelChange
  ) {
    this.graph = graph
    this.graphView = graphView
    this.getNodeNeighbours = getNodeNeighbours
    this.selectedItem = null
    this.onItemMouseOver = onItemMouseOver
    this.onItemSelected = onItemSelected
    this.onGraphModelChange = onGraphModelChange
  }

  graphModelChanged () {
    this.onGraphModelChange(getGraphStats(this.graph))
  }

  selectItem (item) {
    if (this.selectedItem) {
      this.selectedItem.selected = false
    }
    this.selectedItem = item
    item.selected = true
    this.graphView.update()
  }

  deselectItem () {
    if (this.selectedItem) {
      this.selectedItem.selected = false
      this.selectedItem = null
    }
    this.onItemSelected({
      type: 'canvas',
      item: {
        nodeCount: this.graph.nodes().length,
        relationshipCount: this.graph.relationships().length
      }
    })
    this.graphView.update();
  }

  nodeClose (d) {
    this.graph.removeConnectedRelationships(d)
    this.graph.removeNode(d)
    this.deselectItem()
    this.graphView.update()
    this.graphModelChanged()
  }

  nodeClicked (d) {
    if (!d) {
      return
    }
    console.log(d);
    d.fixed = true
    if (!d.selected) {
      this.selectItem(d)
      this.onItemSelected({
        type: 'node',
        item: { id: d.id, labels: d.labels, properties: d.propertyList }
      })
    } else {
      this.deselectItem()
    }
  }

  nodeUnlock (d) {
    if (!d) {
      return
    }
    d.fixed = false
    this.deselectItem()
  }
  nodeDelete (d){
    this.graph._nodes  = this.graph._nodes.filter((v)=>{
      return v.id != d.id;
    })
    this.graph._relationships  = this.graph._relationships.filter((v)=>{
      return v.source.id != d.id && v.target.id != d.id;
    })
    const graphView = this.graphView
    graphView.update();
    message.success('删除成功!');
  }
  nodeNew (d){
    message.success('新增节点,功能开发中!');
    return;
    console.log('新建',d);
    // if (d.expanded) {
    //   this.nodeCollapse(d)
    //   return
    // }
    // d.expanded = true
    const graph = this.graph
    const graphView = this.graphView
    const graphModelChanged = this.graphModelChanged.bind(this)
    // this.getNodeNeighbours(d, this.graph.findNodeNeighbourIds(d.id), function (
    //   err,
    //   { nodes, relationships }
    // ) {
    //   if (err) return
    //   console.log(relationships);
    //   graph.addExpandedNodes(d, mapNodes(nodes))
    //   graph.addRelationships(mapRelationships(relationships, graph))
    //   graphView.update()
    //   graphModelChanged()
    // })
    let relationships = [
      { endNodeId: "1094135",
      id: "1776406",
      properties: {
        source : 'icomarks',
        position : 'Chief Technical Officer , Co-founder 34 age'
      },
      startNodeId: '1173162',
      type: "PERSON_POSITION"}
    ]
    let nodes = [
      {
        id : '1173162',
        labels : ['Person','Icomarks'],
        properties : {
          icomarks_url : ['/ico/social','/ico/nexus'],
          name : 'Sociall',
          updatedAt : ['1564305176.0' , '1564306086.0']
        }
      }
    ]
    graph.addExpandedNodes(d, mapNodes(nodes))
    graph.addRelationships(mapRelationships(relationships, graph))
    graphView.update()
    graphModelChanged()
  }
  nodeEdit (d){
    message.success('修改节点,功能开发中!');
    return;
    console.log('编辑',d);
    d.propertyMap.name = '修改节点';
    const graph = this.graph
    const graphView = this.graphView;
    graphView.update();
  }

  nodeDblClicked (d) {
    console.log(d);
    if (d.expanded) {
      this.nodeCollapse(d)
      return
    }
    d.expanded = true
    const graph = this.graph
    const graphView = this.graphView
    const graphModelChanged = this.graphModelChanged.bind(this)
    this.getNodeNeighbours(d, this.graph.findNodeNeighbourIds(d.id), function (
      err,
      { nodes, relationships }
    ) {
      if (err) return
      console.log(relationships);
      console.log(nodes);
      graph.addExpandedNodes(d, mapNodes(nodes))
      graph.addRelationships(mapRelationships(relationships, graph))
      graphView.update()
      graphModelChanged()
    })
  }

  nodeCollapse (d) {
    d.expanded = false
    this.graph.collapseNode(d)
    this.graphView.update()
    this.graphModelChanged()
  }

  onNodeMouseOver (node) {
    if (!node.contextMenu) {
      this.onItemMouseOver({
        type: 'node',
        item: {
          id: node.id,
          labels: node.labels,
          properties: node.propertyList
        }
      })
    }
  }
  onMenuMouseOver (itemWithMenu) {
    this.onItemMouseOver({
      type: 'context-menu-item',
      item: {
        label: itemWithMenu.contextMenu.label,
        content: itemWithMenu.contextMenu.menuContent,
        selection: itemWithMenu.contextMenu.menuSelection
      }
    })
  }
  onRelationshipMouseOver (relationship) {
    this.onItemMouseOver({
      type: 'relationship',
      item: {
        id: relationship.id,
        type: relationship.type,
        properties: relationship.propertyList
      }
    })
  }

  onRelationshipClicked (relationship) {
    if (!relationship.selected) {
      this.selectItem(relationship)
      this.onItemSelected({
        type: 'relationship',
        item: {
          id: relationship.id,
          type: relationship.type,
          properties: relationship.propertyList
        }
      })
    } else {
      this.deselectItem()
    }
  }

  onCanvasClicked () {
    this.deselectItem()
  }

  onItemMouseOut (item) {
    this.onItemMouseOver({
      type: 'canvas',
      item: {
        nodeCount: this.graph.nodes().length,
        relationshipCount: this.graph.relationships().length
      }
    })
  }

  bindEventHandlers () {
    this.graphView
      .on('nodeMouseOver', this.onNodeMouseOver.bind(this))
      .on('nodeMouseOut', this.onItemMouseOut.bind(this))
      .on('menuMouseOver', this.onMenuMouseOver.bind(this))
      .on('menuMouseOut', this.onItemMouseOut.bind(this))
      .on('relMouseOver', this.onRelationshipMouseOver.bind(this))
      .on('relMouseOut', this.onItemMouseOut.bind(this))
      .on('relationshipClicked', this.onRelationshipClicked.bind(this))
      .on('canvasClicked', this.onCanvasClicked.bind(this))
      .on('nodeClose', this.nodeClose.bind(this))
      .on('nodeClicked', this.nodeClicked.bind(this))
      .on('nodeDblClicked', this.nodeDblClicked.bind(this))
      .on('nodeUnlock', this.nodeUnlock.bind(this))
      .on('nodeDelete', this.nodeDelete.bind(this))
      .on('nodeNew', this.nodeNew.bind(this))
      .on('nodeEdit', this.nodeEdit.bind(this))
    this.onItemMouseOut()
  }
}
