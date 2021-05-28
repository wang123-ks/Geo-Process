const mockFlowData = {
	"nodes": [
		{
			"type": "node",
			"size": "100*48",
			"shape": "flow-capsule",
			"label": "过滤",
			"color": "#E76F00",
			"key_a": "tile_filter",
			"x": 465.5,
			"y": 143,
			"id": "30323533",
			"parent": "2ead9b6f",
			"index": 1
		},
		{
			"type": "node",
			"size": "100*48",
			"shape": "flow-capsule",
			"label": "化简",
			"color": "#E76F00",
			"key_a": "tile_simplify",
			"x": 465.5,
			"y": 233,
			"id": "84560797",
			"parent": "2ead9b6f",
			"index": 2
		},
		{
			"type": "node",
			"size": "100*48",
			"shape": "flow-capsule",
			"label": "生成pbf",
			"color": "#E76F00",
			"key_a": "generate_pbf",
			"x": 465.5,
			"y": 323,
			"id": "e9369105",
			"parent": "2ead9b6f",
			"index": 3
		},
		{
			"type": "node",
			"size": "72*72",
			"shape": "flow-circle",
			"label": "开始",
			"color": "#0573E9",
			"key_a": "task_start",
			"x": 51.671875,
			"y": 233,
			"id": "91b4875f",
			"index": 8
		},
		{
			"type": "node",
			"size": "100*48",
			"shape": "flow-capsule",
			"label": "输入矢量数据",
			"color": "#E76F00",
			"key_a": "select_cd_data",
			"x": 220,
			"y": 83,
			"id": "d2b3fa12",
			"index": 12
		},
		{
			"type": "node",
			"size": "100*48",
			"shape": "flow-capsule",
			"label": "创建空间索引",
			"color": "#E76F00",
			"key_a": "create_spatial_index",
			"x": 220,
			"y": 183,
			"id": "4b797224",
			"index": 13
		},
		{
			"type": "node",
			"size": "100*48",
			"shape": "flow-capsule",
			"label": "创建元数据",
			"color": "#E76F00",
			"key_a": "create_metadata",
			"x": 220,
			"y": 283,
			"id": "c595d4a9",
			"index": 14
		},
		{
			"type": "node",
			"size": "100*48",
			"shape": "flow-capsule",
			"label": "创建瓦片索引",
			"color": "#E76F00",
			"key_a": "create_tile_index",
			"x": 220,
			"y": 383,
			"id": "f33f63a9",
			"index": 15
		},
		{
			"type": "node",
			"size": "100*48",
			"shape": "flow-capsule",
			"label": "输出瓦片数据",
			"color": "#E76F00",
			"key_a": "copy_cd_data",
			"x": 690,
			"y": 233,
			"id": "4aa453ea",
			"index": 18
		},
		{
			"type": "node",
			"size": "72*72",
			"shape": "flow-circle",
			"label": "结束",
			"color": "#0573E9",
			"key_a": "task_end",
			"x": 861,
			"y": 233,
			"id": "287d4b5b",
			"index": 19
		}
	],
	"edges": [
		{
			"source": "30323533",
			"sourceAnchor": 2,
			"target": "84560797",
			"targetAnchor": 0,
			"id": "95afbad0",
			"index": 4
		},
		{
			"source": "84560797",
			"sourceAnchor": 2,
			"target": "e9369105",
			"targetAnchor": 0,
			"id": "a1a67a55",
			"index": 5
		},
		{
			"source": "91b4875f",
			"sourceAnchor": 1,
			"target": "d2b3fa12",
			"targetAnchor": 3,
			"id": "0badbbe6",
			"index": 6
		},
		{
			"source": "d2b3fa12",
			"sourceAnchor": 2,
			"target": "4b797224",
			"targetAnchor": 0,
			"id": "e7e32e81",
			"index": 7
		},
		{
			"source": "f33f63a9",
			"sourceAnchor": 1,
			"target": "30323533",
			"targetAnchor": 3,
			"id": "f0e4ff28",
			"index": 9
		},
		{
			"source": "4b797224",
			"sourceAnchor": 2,
			"target": "c595d4a9",
			"targetAnchor": 0,
			"id": "fad4d55c",
			"index": 10
		},
		{
			"source": "c595d4a9",
			"sourceAnchor": 2,
			"target": "f33f63a9",
			"targetAnchor": 0,
			"id": "c8fbdd46",
			"index": 11
		},
		{
			"source": "4aa453ea",
			"sourceAnchor": 1,
			"target": "287d4b5b",
			"targetAnchor": 3,
			"id": "52989dde",
			"index": 16
		},
		{
			"source": "e9369105",
			"sourceAnchor": 1,
			"target": "4aa453ea",
			"targetAnchor": 3,
			"id": "d0989f3b",
			"index": 17
		}
	],
	"groups": [
		{
			"id": "2ead9b6f",
			"x": 383.5,
			"y": 124,
			"label": "矢量瓦片裁剪",
			"collapsed": false,
			"index": 0
		}
	]
};

export default mockFlowData;