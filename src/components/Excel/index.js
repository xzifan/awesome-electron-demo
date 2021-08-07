import React, { useState, useEffect } from 'react'
import { Upload, message, Spin } from 'antd';
import { InboxOutlined, LeftOutlined } from '@ant-design/icons';
import XLSX from 'xlsx';
import WorkBookViewer from '../WorkBookViewer';
import "./index.scss";
const { Dragger } = Upload;

function Excel(props) {
	const [currFileList, setCurrFileList] = useState([])
	const [currWorkBook, setCurrWorkBook] = useState()
	const [fileLoading, setFileLoading] = useState(false)

	const getFileData = (file) => {
		const reader = new FileReader()
		reader.readAsBinaryString(file)
		console.log(file)
		reader.onload = (event) => {
			setFileLoading(true)
			try {
				const { result } = event.target
				const workbook = XLSX.read( result , { type: 'binary' });
				// console.log(workbook)
				setCurrWorkBook({...workbook, Source: {FileName: file.name, LastModified: file.lastModifiedDate }})
				setFileLoading(false)
			} catch (error) {
				console.log(error)
				setFileLoading(false)
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
			setFileLoading(true)
			// const { status } = info.file;	
			// if (status !== 'uploading') {
			// 	console.log(info.file, info.fileList);
			// 	const path = info.fileList[0].originFileObj.path
			// 	var workbook = XLSX.read(getFileData(path), { type: 'binary' });
			// 	setCurrWorkBook(workbook)
			// 	console.log(workbook)
			// }
		},
		onDrop(e) {
			console.log('Dropped files', e.dataTransfer.files);
			// var workbook = XLSX.read(e.dataTransfer.files[0].path);
			// console.log(workbook)
			// XLSX.utils.sheet_to_html
		},
		fileList: currFileList
	};

	useEffect(() => {
		if (currWorkBook) {

		}
	}, [currWorkBook])

	return <div className="excel-container">
		{currWorkBook && <LeftOutlined className="app-button button-return" onClick={() => setCurrWorkBook()} />}
			{!currWorkBook ?
				<Dragger {...draggerProps} accept=".xls, .xlsx" id="drag_test">
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">Click or drag file to this area to upload</p>
					<p className="ant-upload-hint">
						Support for a single or bulk upload. Strictly prohibit from uploading company data or other
						band files
					</p>
				</Dragger>
				: <WorkBookViewer workbook={currWorkBook} />
			}
			<Spin spinning={fileLoading}></Spin>
	</div>
}

export default Excel;