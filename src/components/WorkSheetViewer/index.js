import { Table, Button, Modal } from 'antd';
import React from 'react';
import XLSX from 'xlsx';
import './index.scss'
import { ArrowRightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const electron = window.require('electron');

const {ipcRenderer} = electron;

const WorksheetViewer = (props) => {
  const workbookParams = props.workbookParams
  // const [showSelectScript, setShowSelectScript] = useState(false)
  const worksheet = props.currentSheet
  const worksheetJSON = XLSX.utils.sheet_to_json(worksheet)
  console.log(worksheet['!ref'],XLSX.utils.decode_range(worksheet['!ref']))
  const workSheetJSONBrief = worksheetJSON.slice(0,100)
  console.log(props)

  let columns = []
  if (workSheetJSONBrief[0])
    columns = Object.keys(workSheetJSONBrief[0]).map((col, index)=>({ title: col, dataIndex: col, key: index, ellipsis: {showTitle: false}, }))
  else columns = []

  const onConfirmSheet = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: <div>
          {/* <span style={{ lineHeight: '22px',fontWeight: 600}}>{ workbook.Source.FileName}</span> <br/> */}
          <div style={{marginTop: '16px'}}>是否将工作表 <span style={{fontWeight: 600}}>{props.sheetName}</span> 进行转换</div>
        </div>,
      okText: '确定',
      cancelText:'取消',
      onOk() {
        console.log(workbookParams)
        ipcRenderer.send("send-message-to-main", workbookParams);
        // setShowSelectScript(true)
        // var db = openDatabase('workbooks', '1.0', 'Test DB', 50 * 1024 * 1024);
        // const colNames = Object.keys(workSheetJSONBrief[0])

        // // CREATE TABLE
        // db.transaction((tx)=>{
        //   tx.executeSql('DROP TABLE IF EXISTS SHEET')
        //   let sql = "CREATE TABLE SHEET (id unique, `"+colNames.join('` varchar(255) , `')+ "` varchar(255))"
        //   tx.executeSql(sql);
        // })

        // // INSERT DATA
        // for (let page = 0; (page - 1) * 500 <  worksheetJSON.length; page++) {
        //   db.transaction(function (tx) {  
        //     console.log('INSERT PAGE NO.' + page)
        //     // let sql1 = `INSERT INTO SHEET (id, name) VALUES (?, ?)` 
        //     // console.log(sql1)
        //     // tx.executeSql(sql1, [1, "name"], ()=>{}, (transaction, error)=>{console.log("Error : " + error.message + " in " + sql1);})
        //     for (let i = 1; i<500 && (page * 500 + i) < worksheetJSON.length ; i++){
        //       let index = page * 500 + i
        //       // for (let j = 0; j < 100 && i+j<worksheetJSON.length; j++ ){
        //         let sql2 = "INSERT INTO SHEET (id, `"+colNames.join('`, `') +"` ) VALUES (" + ' ?' + ', ' + colNames.map(col=>'?').join(', ')+ ' )'
        //         tx.executeSql(sql2,[index, ...Array.from(colNames.map(col=>worksheetJSON[index][col]))]);
        //         // console.log(sql2, [i+j, ...Array.from(colNames.map(col=>worksheetJSON[i+j][col]))])
        //       // }   
        //     }
        //   });
        //   message.success('数据已载入！')
        // }

        // db.transaction((tx)=>{
        //   tx.executeSql('SELECT * FROM SHEET',[], function(context,results){
        //     console.log('TABLE SHEET'.results)
        //   })
        // })
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }
  return <>
      <Button className="worksheet-confirm-btn" type="primary" onClick={onConfirmSheet}>转换该表 <ArrowRightOutlined /></Button>
      {/* <ScriptModal setShowSelectScript={setShowSelectScript} showSelectScript={showSelectScript}/> */}
      <div className="sheet-container">
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
  </>
}

export default WorksheetViewer;