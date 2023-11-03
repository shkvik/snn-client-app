import { v4 as uuidv4 } from 'uuid';


export interface DataTypea
{
  id: number;
  guid: string;
  client: string;
  server: string;
  protocol: string;
  trained: number,
  status: string;
  timeSeriasGuid: string;
}

export interface DataType {
    key: string;
    title: string;
    id: string
    guid: string	
    client: string	
    server: string	
    protocol: string	
    status: string	
    trained: number	
    activity: number[]
    timeSeriasGuid: string	
}


export function GenerateData()
{
    const data: DataType[] = [];
    for(let i = 0; i < 10; i++){
        data.push({
            key: `${i}`,
            title: '',
            id: uuidv4(),
            guid: uuidv4(),
            client: `guid${i}`,	
            server: `guid${i}`,
            protocol: `Modbus`,		
            status: `Learning`,	
            trained: 10,	
            activity: [1,2,3,4],
            timeSeriasGuid: uuidv4(),
        })
    }
    return data;
}