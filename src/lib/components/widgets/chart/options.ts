export default {
	grid: {
		show: true,
		horizontal: {
			show: false
		},
		vertical: {
			show: false
		}
	},
	candle: {
		margin: {
			top: 0.2,
			bottom: 0.1
		},
		// 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
		type: 'candle_solid',
		bar: {
			upColor: '#26A69A',
			downColor: '#EF5350',
			noChangeColor: '#888888'
		},
		area: {
			lineSize: 2,
			lineColor: '#2196F3',
			value: 'close',
			fillColor: [
				{
					offset: 0,
					color: 'rgba(33, 150, 243, 0.01)'
				},
				{
					offset: 1,
					color: 'rgba(33, 150, 243, 0.2)'
				}
			]
		},
		priceMark: {
			show: false
		},
		tooltip: {
			showRule: 'always',
			showType: 'standard',
			labels: ['', 'O:', 'C:', 'H:', 'L:'],
			values: null,
			defaultValue: 'n/a',
			text: {
				size: 10,
				family: 'monospace',
				weight: 'normal',
				color: '#332424',
				marginLeft: 5,
				marginTop: 6,
				marginRight: 5,
				marginBottom: 0
			}
		}
	},
	technicalIndicator: {
		margin: {
			top: 0.2,
			bottom: 0.1
		},
		bar: {
			upColor: '#60B5AC',
			downColor: '#F29A99',
			noChangeColor: '#888888'
		},
		line: {
			size: 1,
			colors: ['#C931CC', '#FFD53D', '#CF2E13', '#174FCF', '#01C5C4']
		},
		circle: {
			upColor: '#60B5AC',
			downColor: '#F29A99',
			noChangeColor: '#888888'
		},
		lastValueMark: {
			show: false
		},
		tooltip: {
			showRule: 'always',
			showName: true,
			showParams: true,
			defaultValue: 'n/a',
			text: {
				size: 10,
				family: 'monospace',
				weight: 'normal',
				color: '#999',
				marginTop: 6,
				marginRight: 8,
				marginBottom: 0,
				marginLeft: 8
			}
		}
	},
	xAxis: {
		show: true,
		height: null,
		axisLine: {
			show: true,
			color: '#888888',
			size: 1
		},
		tickText: {
			show: true,
			color: '#4D4D4D',
			family: 'monospace',
			weight: 'normal',
			size: 10,
			paddingTop: 3,
			paddingBottom: 6
		},
		tickLine: {
			show: true,
			size: 1,
			length: 3,
			color: '#888888'
		}
	},
	yAxis: {
		show: true,
		width: null,
		// 'left' | 'right'
		position: 'right',
		// 'normal' | 'percentage'
		type: 'normal',
		inside: false,
		axisLine: {
			show: true,
			color: '#888888',
			size: 1
		},
		tickText: {
			show: true,
			color: '#4D4D4D',
			family: 'monospace',
			weight: 'normal',
			size: 10,
			paddingLeft: 3,
			paddingRight: 6
		},
		tickLine: {
			show: true,
			size: 1,
			length: 3,
			color: '#888888'
		}
	},
	separator: {
		size: 1,
		color: '#888888',
		fill: true,
		activeBackgroundColor: 'rgba(230, 230, 230, .15)'
	},
	crosshair: {
		show: true,
		horizontal: {
			show: true,
			line: {
				show: true,
				// 'solid'|'dash'
				style: 'dash',
				dashValue: [4, 2],
				size: 1,
				color: '#888888'
			},
			text: {
				show: true,
				color: '#D9D9D9',
				size: 10,
				family: 'monospace',
				weight: 'normal',
				paddingLeft: 2,
				paddingRight: 2,
				paddingTop: 2,
				paddingBottom: 2,
				borderSize: 1,
				borderColor: '#505050',
				backgroundColor: '#505050'
			}
		},
		vertical: {
			show: true,
			line: {
				show: true,
				// 'solid'|'dash'
				style: 'dash',
				dashValue: [4, 2],
				size: 1,
				color: '#888888'
			},
			text: {
				show: true,
				color: '#D9D9D9',
				size: 10,
				family: 'monospace',
				weight: 'normal',
				paddingLeft: 2,
				paddingRight: 2,
				paddingTop: 2,
				paddingBottom: 2,
				borderSize: 1,
				borderColor: '#505050',
				backgroundColor: '#505050'
			}
		}
	},
	graphicMark: {
		line: {
			color: '#2196F3',
			size: 1
		},
		point: {
			backgroundColor: '#2196F3',
			borderColor: '#2196F3',
			borderSize: 1,
			radius: 4,
			activeBackgroundColor: '#2196F3',
			activeBorderColor: '#2196F3',
			activeBorderSize: 1,
			activeRadius: 6
		},
		polygon: {
			stroke: {
				size: 1,
				color: '#2196F3'
			},
			fill: {
				color: 'rgba(33, 150, 243, 0.1)'
			}
		},
		arc: {
			stroke: {
				size: 1,
				color: '#2196F3'
			},
			fill: {
				color: 'rgba(33, 150, 243, 0.1)'
			}
		},
		text: {
			color: '#2196F3',
			size: 10,
			family: 'monospace',
			weight: 'normal',
			marginLeft: 2,
			marginRight: 2,
			marginTop: 2,
			marginBottom: 6
		}
	},
	annotation: {
		symbol: {
			// 'diamond' | 'circle' | 'rect' | 'triangle' | 'custom' | 'none'
			type: 'diamond',
			// 'top' | 'bottom' | 'point'
			position: 'top',
			size: 8,
			color: '#1e88e5',
			activeSize: 10,
			activeColor: '#FF9600',
			offset: [0, 20]
		}
	}
};
