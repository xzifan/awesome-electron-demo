import React, { useState, useEffect } from 'react'
import { Upload, message, Spin } from 'antd';
import { InboxOutlined, LeftOutlined, LoadingOutlined } from '@ant-design/icons';
import XLSX from 'xlsx';
import WorkBookViewer from '../WorkBookViewer';
import "./index.scss";
import iconv from 'iconv-lite';

const electron = window.require('electron');

const {ipcRenderer} = electron;
// console.log(ipcRenderer)

const { Dragger } = Upload;

function Excel(props) {
	const [currWorkBook, setCurrWorkBook] = useState()
	const [fileLoading, setFileLoading] = useState()
	const [container, setContainer] = useState(null);

	const getFileData = (file) => {
		const reader = new FileReader()
		reader.readAsBinaryString(file)
		console.log(file)
		setFileLoading(file.name)
		const collectionNames = ipcRenderer.sendAsync('SaveDataFromPathToDB', file.path); //gbk解码中文字符
		reader.onload = (event) => {
			try {
				const { result } = event.target
				const workbook = XLSX.read( result , { type: 'binary' });
				// console.log(workbook)
				setCurrWorkBook({...workbook, Source: {FileName: file.name, LastModified: file.lastModifiedDate }})
				setFileLoading()
			} catch (error) {
				console.log(error)
				setFileLoading()
			}
		}
		return false
	}

	const draggerProps = {
		name: 'file',
		multiple: false,
		// action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
		beforeUpload: getFileData,
		onChange(info) {
			console.log('onchange info:', info)
			setFileLoading(info.file.name)
		},
		onDrop(e) {
			console.log('Dropped files', e.dataTransfer.files);
		}
	};

	// useEffect(() => {
	// 	if (currWorkBook) {

	// 	}
	// }, [currWorkBook])

	return <div className="excel-container" ref={setContainer}>
		{currWorkBook && <LeftOutlined className="app-button button-return" onClick={() => setCurrWorkBook()} />}
		{!currWorkBook ?
			<Dragger {...draggerProps} className="excel-dragger" accept=".xls, .xlsx" id="drag_test" style={{filter: fileLoading ? 'blur(5px)' : 'none' }}>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">点击或拖入文件进行预览</p>
				<p className="ant-upload-hint">
					Support for a single or bulk upload. Strictly prohibit from uploading company data or other
					band files
				</p>
			</Dragger>
			: <WorkBookViewer workbook={currWorkBook} container={container}/>
		}
		{	fileLoading &&
			<div className="popup-layout">
				<div className="popup-mask"></div>
				<Spin 
					spinning={fileLoading} 
					indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
				></Spin>
				<span style={{margin: '20px'}}>正在载入文件 {fileLoading} ...</span>
			</div>
		}
	</div>
}

export default Excel;