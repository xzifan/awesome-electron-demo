import { Table } from 'antd';
import React from 'react'
import XLSX from 'xlsx';
import './index.scss'

const worksheetViewer = (props) => {
  const worksheet = props.currentSheet
  const worksheetJSON = XLSX.utils.sheet_to_json(worksheet)
  console.log(worksheet['!ref'],XLSX.utils.decode_range(worksheet['!ref']))
  const workSheetJSONBrief = worksheetJSON.slice(0,100)
  console.log(workSheetJSONBrief)

  let columns = []
  if (workSheetJSONBrief[0])
    columns = Object.keys(workSheetJSONBrief[0]).map((col, index)=>({ title: col, dataIndex: col, key: index, ellipsis: {showTitle: false}, }))
  else columns = []

  // .map(item=>{
  //   const obj = {}
  //   Object.keys(item).map((key,index)=>{
  //     obj[index] = item[key] // dataIndex 替换为数字索引
  //   })
  //   return obj 
  // })
  // console.log(workSheetJSONBrief, columns)
  return <div className="sheet-container">
      {
        props.currentSheet && 
          <Table 
            sticky
            showHeader
            size="small"
            dataSource={workSheetJSONBrief} 
            columns={ columns }
            scroll={{x: 'max-content'}}
            pagination={{
              position: 'topRight',
              defaultPageSize: 15
            }}
          >
          </Table>
      }
  </div>
}

export default worksheetViewer;