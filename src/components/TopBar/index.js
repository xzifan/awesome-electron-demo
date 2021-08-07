import React, { useState, useEffect } from 'react'
import './index.scss';
import { MinusOutlined, CloseOutlined, FullscreenOutlined } from '@ant-design/icons';

function TopBar(props) {
	useEffect(() => {
		console.log(window.__custom_menu)
	})
	const [minimized, setMinimized] = useState(false)

	return <div className="app-topbar">
		<div className="topbar-draggable">
		</div>
		<div className="topbar-options ">
			<MinusOutlined id='minimize-btn' className="app-button"/>
			{/* <FullscreenOutlined /> */}
			<CloseOutlined id='close-btn' className="app-button"/>		
		</div>
	</div>
}

export default TopBar;