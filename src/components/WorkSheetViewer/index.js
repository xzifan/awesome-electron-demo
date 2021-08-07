import { Table } from 'antd';
import React from 'react'
import XLSX from 'xlsx';

export default (props) => {
  const worksheet = props.currentSheet
  const worksheetJSON = XLSX.utils.sheet_to_json(worksheet)
  
  const columns = Object.keys(worksheetJSON[0]).map((col, index)=>({ title: col, dataIndex: col, key: index,  }))
  const workSheetJSONBrief = worksheetJSON.slice(0,100)
  // .map(item=>{
  //   const obj = {}
  //   Object.keys(item).map((key,index)=>{
  //     obj[index] = item[key] // dataIndex 替换为数字索引
  //   })
  //   return obj 
  // })
  console.log(workSheetJSONBrief, columns)
  return <div className="sheet-container">
      <div className="sheet-preview">
      {
        props.currentSheet && 
          <Table 
            sticky
            showHeader
            size="small"
            dataSource={workSheetJSONBrief} 
            columns={ columns }
            // scroll={{x: 'max-content'}}
            pagination={{
              position: 'topRight',
              defaultPageSize: 15
            }}
          >
          </Table>
      }
    </div>
  </div>
}
