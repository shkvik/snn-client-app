import React from 'react';

import './Dashboard.css';

import ActivityChart from '../../components/activity-chart/ActivityChart';
import { ProtocolChart } from '../../components/protocol-chart/ProtocolChart';
import { ProgressChart } from '../../components/progress-chart/ProgressChart';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Progress, Badge, Divider } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningStep from '../../components/learning-step/LearningStep';
import { DataType, GenerateData } from './DashBoardData';


function getStatusComponent(status: string){
  switch(status){
    case "Learning": return <Badge status="processing" text="Learning" />;
  }
}

function getTrainedComponent(trained: number){
  return <Progress percent={trained} steps={5} />;
}


// export interface DataType
// {
//   id: number;
//   guid: string;
//   client: string;
//   server: string;
//   protocol: string;
//   trained: number,
//   status: string;
//   timeSeriasGuid: string;
// }


function parseData(data: DataType[]) {
  var dataConnections = new Array();

  data.forEach(function(value: DataType, index) {
      //console.log(value);
      dataConnections.push({
        key: index,
        id: value.guid,
        client: value.client,
        server: value.server,
        protocol: value.protocol,
        trained: getTrainedComponent(value.trained),
        status: getStatusComponent(value.status),
        activity: <ActivityChart 
                    guid={value.timeSeriasGuid}
                    type='Float'
                    />
      });
      
  });
  return dataConnections;
}


const Dashboard = () => {

    const dashboardRef = useRef<any>();

    dashboardRef.current = Dashboard;

    const [data, setDataDashboard] = useState(null);
    const [socket, setSocket] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    
    // function delegateChangeTableValue (key, newValue) {
      
    //   setDataDashboard(prevData => {
    //     // Клонируем текущий массив данных
    //     const newData = [...prevData];
    //     // Находим индекс строки с соответствующим ключом
    //     const rowIndex = newData.findIndex(item => item.key === key);
    //     // Если индекс найден, обновляем значение в этой строке
    //     if (rowIndex !== -1) {
    //       newData[rowIndex].status = newValue;
    //     }
    //     // Возвращаем новый массив данных
    //     return newData;
    //   });
    // }

    const searchInput = useRef(null);
    
    const columns = [
        {
          title: 'Id',
          dataIndex: 'key',
          key: 'key',
          className: 'my-cursor-pointer', // добавляем стиль курсора    
        },
        {
          title: 'GUID',
          dataIndex: 'id',
          key: 'id',
          className: 'my-cursor-pointer', // добавляем стиль курсора         
        },
        {
            title: 'Client',
            dataIndex: 'client',
            key: 'client',
            className: 'my-cursor-pointer',
        },
        {
            title: 'Server',
            dataIndex: 'server',
            key: 'server',
            className: 'my-cursor-pointer',
        },
        {
            title: 'Protocol',
            dataIndex: 'protocol',
            className: 'my-cursor-pointer',
            key: 'protocol',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            className: 'my-cursor-pointer',
            key: 'status',
        },
        {
            title: 'Trained',
            dataIndex: 'trained',
            className: 'my-cursor-pointer',
            key: 'trained',
        },
        {
          title: 'Activity',
          dataIndex: 'activity',
          key: 'activity',
          className: 'my-cursor-pointer',
        },
      ];
      let navigate = useNavigate();

      const handleRowClick = (record: any) => {
        navigate(`/dashboard/modbus/${record.id}`);
      };

      // const getRowClassName = (record) => {
      //   // Проверяем значение статуса
      //   if (record.status.props.status == "processing") {
      //     // Возвращаем имя класса стиля, который изменит цвет строки на красный
      //     return 'row-critical';
      //   }
      //   // Возвращаем пустую строку, если нет необходимости изменять стиль строки
      //   return '';
      // };

      // useEffect(() => {
      //   const ws = new WebSocket("ws://localhost:8080");
      //   setSocket(ws);
      //   ws.onopen = function(e) {
      //     const unixTime = Math.floor(new Date().getTime() / 1000);
      //     var request = {
      //         jsonrpc: "2.0",
      //         method: "GetConections",
      //         params: [],
      //         id: unixTime
      //     }
          
      //     ws.send(JSON.stringify(request));
      //   };

      //   ws.onmessage = function(event) {
      //     var newData = JSON.parse(event.data);
          
      //     newData = parseData(newData, delegateChangeTableValue);
      //     setDataDashboard(newData);
      //     ws.close();
      //   };

      //   ws.onclose = function(event) {
      //     console.log(`close websocket`);
      //   };

      //   return () => {
      //     ws.close();
      //   };
      // }, []);

    return (
      <div style={{ width: '100%', height: '100%' }}>

        <div style={
          {
            marginBottom: 30,
            marginTop: 20,
            marginLeft: '15%',
            marginRight: '15%'
          }}>
          <LearningStep/>
        </div>
        <Divider/>
        <div style={
          { 
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 80,
            marginLeft: '10%',
            marginRight: '10%'
          }}>
        <ProtocolChart/>

        <ProgressChart title={'Learning Nodes'} percent={80}/>
        <ProgressChart title={'Learned Nodes'} percent={5}/>
        <ProgressChart title={'Inactivated Nodes'} percent={15}/>

        </div>
        
        

        <Table columns={columns}
               dataSource={parseData(GenerateData())}
               //rowClassName={getRowClassName}
               onRow={(record) => ({onClick: () => handleRowClick(record)})}
             />
      </div>
    );
};

export default Dashboard;