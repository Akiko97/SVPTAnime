<script>
  import { onMount } from 'svelte'
  import * as Blockly from 'blockly'
  import DarkTheme from '@blockly/theme-dark'
  let workspace = null
  const initBlockly = () => {
    Blockly.defineBlocksWithJsonArray([
      {
        "type": "group",
        "message0": "Group %1",
        "args0": [
          {
            "type": "input_statement",
            "name": "NAME",
            "check": [
              "swap",
              "move",
              "assign"
            ]
          }
        ],
        "inputsInline": true,
        "previousStatement": "group",
        "nextStatement": "group",
        "colour": 120,
        "tooltip": "",
        "helpUrl": ""
      },
      {
        "type": "swap",
        "message0": "Swap %1 and %2",
        "args0": [
          {
            "type": "input_value",
            "name": "reg1",
            "check": null
          },
          {
            "type": "input_value",
            "name": "reg2",
            "check": null
          }
        ],
        "inputsInline": true,
        "previousStatement": [
          "swap",
          "move",
          "assign"
        ],
        "nextStatement": [
          "swap",
          "move",
          "assign"
        ],
        "colour": 65,
        "tooltip": "",
        "helpUrl": ""
      },
      {
        "type": "move",
        "message0": "Move %1 to %2",
        "args0": [
          {
            "type": "input_value",
            "name": "reg1",
            "check": null
          },
          {
            "type": "input_value",
            "name": "reg2",
            "check": null
          }
        ],
        "inputsInline": true,
        "previousStatement": [
          "swap",
          "move",
          "assign"
        ],
        "nextStatement": [
          "swap",
          "move",
          "assign"
        ],
        "colour": 290,
        "tooltip": "",
        "helpUrl": ""
      },
      {
        "type": "assign",
        "message0": "Assign %1 to %2",
        "args0": [
          {
            "type": "field_number",
            "name": "num",
            "value": 0
          },
          {
            "type": "input_value",
            "name": "reg",
            "check": null
          }
        ],
        "inputsInline": true,
        "previousStatement": [
          "swap",
          "move",
          "assign"
        ],
        "nextStatement": [
          "swap",
          "move",
          "assign"
        ],
        "colour": 20,
        "tooltip": "",
        "helpUrl": ""
      },
      {
        "type": "reg_bit",
        "message0": "%1 %2 [ %3 : %4 ]",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "name",
            "options": [
              [
                "XMM",
                "XMM"
              ],
              [
                "YMM",
                "YMM"
              ],
              [
                "ZMM",
                "ZMM"
              ]
            ]
          },
          {
            "type": "field_number",
            "name": "number",
            "value": 0,
            "min": 0,
            "max": 31,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "end_bit",
            "value": 255,
            "min": 0,
            "max": 511,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "start_bit",
            "value": 0,
            "min": 0,
            "max": 511,
            "precision": 1
          }
        ],
        "inputsInline": true,
        "output": [
          "swap",
          "move",
          "assign"
        ],
        "colour": 230,
        "tooltip": "Register: select bits by bit",
        "helpUrl": "N/A"
      },
      {
        "type": "reg_index",
        "message0": "%1 %2 [ %3 ]",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "name",
            "options": [
              [
                "XMM",
                "XMM"
              ],
              [
                "YMM",
                "YMM"
              ],
              [
                "ZMM",
                "ZMM"
              ]
            ]
          },
          {
            "type": "field_number",
            "name": "number",
            "value": 0,
            "min": 0,
            "max": 31,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "index",
            "value": 0,
            "min": 0,
            "max": 15,
            "precision": 1
          }
        ],
        "inputsInline": true,
        "output": [
          "swap",
          "move",
          "assign"
        ],
        "colour": 260,
        "tooltip": "Register: select bits by index",
        "helpUrl": "N/A"
      }
    ])
    workspace = Blockly.inject('blockly-div', {
      toolbox: {
        'kind': 'categoryToolbox',
        'contents': [
          {
            'kind': 'category',
            'name': 'SIMD Control',
            'contents': [
              {
                'kind': 'block',
                'type': 'group'
              },
              {
                'kind': 'block',
                'type': 'swap'
              },
              {
                'kind': 'block',
                'type': 'move'
              },
              {
                'kind': 'block',
                'type': 'assign'
              },
            ]
          },
          {
            'kind': 'category',
            'name': 'Register & Number',
            'contents': [
              {
                'kind': 'block',
                'type': 'reg_bit'
              },
              {
                'kind': 'block',
                'type': 'reg_index'
              },
            ]
          }
        ],
      },
      trashcan: true,
      theme: DarkTheme,
    })
    workspace.addChangeListener(() => {
      // console.log(javascriptGenerator.workspaceToCode(workspace))
    })
  }
  onMount(() => {
    initBlockly()
  })
</script>

<div style="width: 100%; height: 100%;">
  <div id="blockly-div"></div>
</div>

<style>
  #blockly-div {
    height: 100%;
    width: 100%;
  }
</style>
