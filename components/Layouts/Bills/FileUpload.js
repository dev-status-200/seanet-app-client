import React, { useState, useEffect, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import * as XLSX from "xlsx";
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Barcode from 'react-barcode';
import axios from 'axios';
import { useSelector } from 'react-redux';

const FileUpload = ({clientData, setBulkOrders}) => {

    const inputRef = useRef(null);
    const theme = useSelector((state) => state.theme.value);
    const [uploadFileDate, setUploadFileDate] = useState([]);
    const [fileData, setFileData] = useState([]);
    const [excelFile, setExcelFile] = useState([]);

    const [load, setLoad] = useState(false);

    useEffect(() => {
        if(excelFile.length==0){
          setFileData([])
        }
    }, [excelFile]);

    const reader = async(fliez) => {

      setLoad(true)
        const [file] = fliez;
        const reader = new FileReader();
    
        reader.onload = (evt) => {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          //console.log(data);
          //setFileData(data);
          
          getClients(data);
        };
        reader.readAsBinaryString(file);
    };

    const getClientId = (name) => {
      //console.log(clientData)
      let values = ''
      for(let i = 0; i<clientData.result.length;i++){
          if(clientData.result[i].name==name){
              values = clientData.result[i].id
          }
      }
      return values;
    }

    const getClients = (data) => {
      let uploadData = [];
      data.forEach((x) => {
        uploadData.push({
          invoice:x.Invoice,
          name:x.Client,
          job:x.Job,
          machineNo:x.GD,
          balance:x.Amount,
          code:x.Invoice,
          status:'pending',
          active:1
        })
      });
      setFileData(data);
      //console.log(uploadData)
      uploadBulkData(uploadData)
    }

    // const getClients = (data) => {
    //   let newData = [];
    //   let count = 0;

    //   for(let i=0; i<data.length; i++){
    //     if(i==0){
    //       newData.push(data[i]);
    //     }
    //     for(let j=count; j<newData.length; j++){
    //       if(i!=0){
    //         if(newData[j].Client!=data[i].Client){
    //           newData.push(data[i]);
    //           count++;
    //           break;
    //         }else{
    //           newData[j].Amount = newData[j].Amount+ data[i].Amount
    //         }
    //       }
    //     } 
    //   }
    //   //console.log(newData);

    //   let uploadData = [];

    //   newData.forEach((x) => {
    //     uploadData.push({
    //       invoice:x.Invoice,
    //       job:x.Job,
    //       machineNo:x.GD,
    //       balance:x.Amount,
    //       code:x.Invoice,
    //       status:'pending',
    //       active:1,
    //       ClientId:getClientId(x.Client)
    //     })
    //   });
    //   setFileData(newData);
    //   setLoad(false);
    //   //uploadBulkData(uploadData)
    // }

    const uploadBulkData = async(uploadData) => {
      console.log(uploadData)
      console.log('Bulk Upload')
      await axios.post(process.env.NEXT_PUBLIC_TEST_BILLS_CREATE_BULK_ORDERS_POST,{
        data:uploadData
      }).then((x)=>{
        if(x.data.status=='success'){
          setLoad(false);
          setBulkOrders(x.data.result)
        }
      })
    }

  return (
    <div className={theme=='light'?'lightTheme':'darkTheme'}>
      <div className='mt-5'>
        <div style={{textAlign:'center'}}>
        <input type="file" style={{border:'1px solid silver', padding:100}} 
          onChange={(e)=>{
            setExcelFile(e.target.files)
            if(e.target.files.length!=0){
              reader(e.target.files);
            }
          }} 
          files={excelFile} /><br/>
        <ReactToPrint
          content={() =>inputRef}
          trigger={() => <button className="custom-btn mt-3" disabled={load?true:false}>
              {load?<Spinner className='mx-4' animation="border" size="sm" />:'Print to PDF!'}
            </button>}
          />
        {/* <button className="purple-btn mt-3 mx-2" onClick={uploadBulkData}>Save Files</button> */}
        </div>
      </div>
      <div className='my-5' ref={(response) => (inputRef = response)}>
        <div style={{textAlign:'center'}}>
            {
            fileData.map((x,i)=>{
                return(
                    <div className='mx-3' key={i} style={{display:'inline-block', width:230}}>
                      {!load &&
                      <>
                        <h5 style={{maxWidth:250}}>{x.Client}</h5>
                        <div style={{fontSize:13}}>
                            <span>{"("}{x.Invoice}{")"} </span>
                            <span>{"("}{x.Job}{")"} </span>
                            <span>{"("}{x.GD}{")"} </span>
                        </div>
                        <div>Rs.{" "}{x.Amount}</div>
                        <Barcode value={`${x.Invoice}`} />
                        <hr/>
                      </>}
                    </div>
                  )
                }
              )
            }
          </div>
        </div>
      </div>
  )
}

export default FileUpload;