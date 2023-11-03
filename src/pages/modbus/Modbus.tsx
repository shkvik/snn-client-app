import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';

import { DownOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Space, Table, Button, Popconfirm, message, Progress, Card, Col, Row  } from 'antd';

import ActivityChart from '../../components/activity-chart/ActivityChart';

function getStatusComponent(status: string){
    switch(status){
        case "Learning": return <Badge status="processing" text="Learning" />;
    }
}
  
function getTrainedComponent(trained: number){
    return <Progress percent={trained} steps={5} />;
}


export interface IModbusDataRegister {
    id: number;
    name: string;
    status: string;
    train: number;
    ts_guid: string;
}



function parseDataRegisters(data: IModbusDataRegister[], type: string){
    var dataConnections = new Array();
    data.forEach(function(value, index) {
        console.log(value);

        dataConnections.push({
            key: index + 1,
            registerNumber: value.id,
            name: value.name,
            statusState: getStatusComponent(value.status),
            trainState: <Progress type="circle" size={35} percent={value.train} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />,
            time_series: <ActivityChart guid={value.ts_guid} type={type}/>,
        });
        
    });
    return dataConnections;
}



export interface DataFunctions
{
    code: number;
    name: string;
    type: string;
    status: string;
    train: number;
    access: string;
    ts_guid: string;
}

function parseDataFunctions(data: DataFunctions[]) {
    var dataConnections = new Array();
  
    data.forEach(function(value, index) {
        dataConnections.push({
            key: index + 1,
            code: value.code,
            name: value.name,
            type: value.type,
            status: getStatusComponent(value.status),
            train: <Progress type="circle" size={35} percent={value.train} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />, 
            access: value.access,
            activity: <ActivityChart guid={value.ts_guid} type='Float'/>,
            
        });
        
    });
    return dataConnections;
  }

export interface IInitModbusData {
    activityGuid: string,
    functions: number[],
    discreteInputs: number[],
    coils: number[],
    inputRegisters: number[],
    holdingRegisters: number[],
}


function InitModbusData(message: IInitModbusData){
    console.log('read message')
    
    const data = new Array();
    data.push({
        key: 0,
        direction: 'Functions Activity',
        status:  <Badge status="processing" text="Learning" />,
        train: <Progress type="circle" size={50} percent={20} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />,
        activity: <ActivityChart guid={message.activityGuid} type='Float'/>,
        data: message.functions,
    });
    
    data.push({
        key: 1,
        direction: 'Discrete Inputs',
        // action: btnTrain(),
        status:  <Badge status="processing" text="Learning" />,
        train: <Progress type="circle" size={50} percent={90} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />,
        activity: <ActivityChart guid={message.activityGuid} type={"Logic"}/>,
        data: message.discreteInputs,
    });

    data.push({
        key: 2,
        direction: 'Coils',
        // action: btnTrain(),
        status:  <Badge status="processing" text="Learning" />,
        train: <Progress type="circle" size={50} percent={70} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />,
        activity: <ActivityChart guid={message.activityGuid} type={"Logic"}/>,
        data: message.coils,
    });

    data.push({
        key: 3,
        direction: 'Input Registers',
        // action: btnTrain(),
        status:  <Badge status="success" text="Normal" />,
        train: <Progress type="circle" size={50} percent={100} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />,
        activity: <ActivityChart guid={message.activityGuid} type={"Logic"}/>,
        data: message.inputRegisters,
    });

    data.push({
        key: 4,
        direction: 'Holding Registers',
        // action: btnTrain(),
        status:  <Badge status="success" text="Normal" />,
        train: <Progress type="circle" size={50} percent={100} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />,
        activity: <ActivityChart guid={message.activityGuid} type={"Logic"}/>,
        data: message.holdingRegisters,
    });
    console.log(data)
    return data;
}



interface IRecord {
    direction: string;
    data: any;
}

const Modbus = () => {
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [socket, setSocket] = useState(null);

    console.log(id);

    const getExpandedRowRender = (record: IRecord) => {
        
        // console.log(`print record`)
        console.log(record)
        let expandedRowContent;

        if(record.direction != "Functions Activity"){
            
            const columns = [
                {
                    title: 'Register ID',
                    dataIndex: 'registerNumber',
                    key: 'register',
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'Status',
                    dataIndex: 'statusState',
                    key: 'statusState',
                },
                {
                    title: 'Train',
                    dataIndex: 'trainState',
                    key: 'trainState',
                },
                {
                    title: 'Time Series',
                    dataIndex: 'time_series',
                    key: 'time_series',
                },
            ];
    
            const btnsRegisters = () => {
                return(
                    <Space size="middle">
                        <Popconfirm
                            placement="leftTop"
                            title={'Train'}
                            description={'description'}
                            onConfirm={confirm}
                            okText="Yes"
                            cancelText="No"> 

                            <a>Train</a>
    
                        </Popconfirm>
    
                        <Popconfirm
                        placement="leftTop"
                        title={'Rename'}
                        description={'description'}
                        onConfirm={confirm}
                        okText="Yes"
                        cancelText="No"
                        >   
                            <a>Rename</a>
                
                        </Popconfirm>
                    </Space>
                )
            }
            var dataType;

            console.log(record)

            if(record.direction == 'Discrete Inputs' || record.direction == 'Coils')
            {
                console.log("YES");
                dataType = "Logic"
            }
            else {
                dataType = "Float"
            }
            const data = parseDataRegisters(record.data, dataType);

            expandedRowContent = (
                <Table
                    columns={columns} 
                    dataSource={data} 
                    pagination={{
                        pageSize: 4, // количество строк на странице
                        total: data.length, // общее количество строк в таблице
                    }}
                />
            );
        }
        else{
            //** Functions  **//
            const columns = [
                {
                    title: 'Code',
                    dataIndex: 'code',
                    key: 'code',
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'Type',
                    dataIndex: 'type',
                    key: 'type',
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                },
                {
                    title: 'Train',
                    dataIndex: 'train',
                    key: 'train',
                },
                {
                    title: 'Access',
                    dataIndex: 'access',
                    key: 'access',
                },
                {
                    title: 'Activity',
                    dataIndex: 'activity',
                    key: 'activity'
                },
            ];
            
    
            const btnsFunctions = () => {
                return(
                    <Space size="middle">
                        <Popconfirm
                            placement="leftTop"
                            title={'Train'}
                            description={'description'}
                            onConfirm={confirm}
                            okText="Yes"
                            cancelText="No"
                        >   
                            <a>Train</a>
    
                        </Popconfirm>
                    </Space>
                )
            }
            const data = parseDataFunctions(record.data)
            expandedRowContent = (
                <Table
                    columns={columns} 
                    dataSource={data} 
                    pagination={{
                        pageSize: 4, // количество строк на странице
                        total: data.length, // общее количество строк в таблице
                    }}
                />
            );
        }

        return expandedRowContent;
    };

    
    const columns = [
        {
            title: 'Direction',
            dataIndex: 'direction',
            key: 'direction',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Train',
            dataIndex: 'train',
            key: 'train',
            align: 'center'
        },
        {
            title: 'Activity',
            dataIndex: 'activity',
            key: 'activity'
        },
    ];

    const confirm = () => {
        message.info('Clicked on Yes.');
    };

    const btnTrain = () => {
        return(
        <Popconfirm
            placement="leftTop"
            title={'text'}
            description={'description'}
            onConfirm={confirm}
            okText="Yes"
            cancelText="No"
        >   
            <Button 
                type="primary"
                icon={<ThunderboltOutlined />}
                shape="round"
            > Train</Button>

        </Popconfirm> )
    }

    // useEffect(() => {
    //     const ws = new WebSocket("ws://localhost:8080");
    //     setSocket(ws);
    //     ws.onopen = function(e) {
    //         const unixTime = Math.floor(new Date().getTime() / 1000);
    //         var request = {
    //             jsonrpc: "2.0",
    //             method: "GetConnectionData",
    //             params: [id],
    //             id: unixTime
    //         }
    //         ws.send(JSON.stringify(request));
    //     };

    //     ws.onmessage = function(event) {
    //       var newData = JSON.parse(event.data);
    //       console.log(newData);
    //       newData = InitModbusData(newData);
            
    //       console.log(newData);
    //       setData(newData);  
    //       ws.close();
    //     };

    //     ws.onclose = function(event) {
    //       console.log(`close websocket`);
    //     };

    //     return () => {
    //       ws.close();
    //     };
    //   }, []);


    return (
            <div style={{ width: '100%', height: '100%' }}>
                <Table
                    //columns={columns}
                    pagination={false}
                    bordered
                    expandedRowRender={getExpandedRowRender}
                    //dataSource={data}
                />
            </div>
    );
};
export default Modbus;