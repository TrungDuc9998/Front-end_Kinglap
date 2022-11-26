import React from 'react'
import "antd/dist/antd.css";
import { Tabs } from 'antd';
import BatteryCharger from './BatteryCharger';
import Origin from './Origin';
import Processor from './Processor';
import Storage from './Storage';
import Screen from './Screen';
import Ram from './Ram';
import Color from './Color';
  
const { TabPane } = Tabs;
  
function Accessories() {
  return (
    <div style={{
      display: 'block', padding: 30
    }}>
      <h4>Quản lý linh kiện</h4>
      <div className="card-container">
      <Tabs type="card">
        <TabPane tab="Xuất xứ" key="1">
          <Origin/>
        </TabPane>
        <TabPane tab="Bộ xử lý" key="2">
          <Processor/>
        </TabPane>
        <TabPane tab="Lưu trữ" key="3">
          <Storage/>
        </TabPane>
        <TabPane tab="Pin & Sạc" key="4">
          <BatteryCharger/>
        </TabPane>
        <TabPane tab="Màn hình" key="5">
          <Screen/>
        </TabPane>
        <TabPane tab="Ram" key="6">
          <Ram/>
        </TabPane>
        <TabPane tab="Màu" key="7">
          <Color/>
        </TabPane>
        <TabPane tab="Chi tiết màu" key="8">
          
        </TabPane>
        <TabPane tab="Card rời" key="9">
          3rd TAB PANE Content
        </TabPane>
        <TabPane tab="Card onboard" key="10">
          3rd TAB PANE Content
        </TabPane>
        <TabPane tab="Đồ họa" key="11">
          3rd TAB PANE Content
        </TabPane>
        
      </Tabs>
      </div>
    </div>
  );
}
export default Accessories;