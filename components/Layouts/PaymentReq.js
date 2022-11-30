import { Row, Col, Table, Form, Spinner, Dropdown } from 'react-bootstrap';
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircleOutlined, EditOutlined } from '@ant-design/icons';
import ReactToPrint from 'react-to-print';
import { useSelector } from 'react-redux';
import { saveAs } from 'file-saver';
import Cookies from 'js-cookie';
import { Modal } from 'antd';
import moment from 'moment';
import Excel from 'exceljs';
import axios from 'axios';

const columns = [
    { header: 'V No.', key: 'id' },
    { header: 'Reason', key: 'reason' },
    { header: 'Requested By', key: 'reqBy' },
    { header: 'Paid To', key: 'paidTo' },
    { header: 'Approved Date', key: 'approvedDate' },
    { header: 'Amount', key: 'amount' },
];

const workSheetName = 'Worksheet-1';
const workBookName = 'MyWorkBook';
const myInputId = 'myInput';

const PaymentReq = ({sessionData, payRequestData, adminData}) => {

    const inputRef = useRef(null);

    const [ load, setLoad ] = useState(false);
    const [ edit, setEdit ] = useState(false);
    const [ approve, setApprove ] = useState(false);
    const [ selectedRequest, setSelectedRequest ] = useState({});

    const [ type, setType ] = useState('');
    const [ visible, setVisible ] = useState(false);
    const theme = useSelector((state) => state.theme.value);

    const [reqType, setReqType] = useState({loan:false, advance:false, expense:false});
    const [reason, setReason] = useState('');
    const [amount, setAmount] = useState('');
    const [company, setCompany] = useState('Cargo Linkers');
    const [reqBy, setReqBy] = useState('');
    const [paidTo, setPaidTo] = useState('');
    const [rupees, setRupees] = useState('');
    const [approvedBy, setApprovedBy] = useState('');

    const [records, setRecords] = useState([]);
    const [adminList, setAdminList] = useState([]);

    const workbook = new Excel.Workbook();

    const saveExcel = async () => {
        try {
        const myInput = document.getElementById(myInputId);
        const fileName = myInput.value || workBookName;
        const worksheet = workbook.addWorksheet(workSheetName);
        worksheet.columns = columns;
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns.forEach(column => {
            console.log(column)
            if(column._header=='V No.'||column._header=='Amount'){
                column.width = column.header.length + 4;
            }else if(column._header=='Reason'||column._header=='Approved Date'){
                column.width = column.header.length + 35;
            }else if(column._header=='Requested By' ||column._header=='Paid To'){
                column.width = column.header.length + 8;
            }
            column.alignment = { horizontal: 'left' };
        });
        payRequestData.forEach(singleData => {
            if(singleData.company==company){
                worksheet.addRow(singleData);
            }
        });
        worksheet.eachRow({ includeEmpty: false }, row => {
            const currentCell = row._cells;
            currentCell.forEach(singleCell => {
            const cellAddress = singleCell._address;
            worksheet.getCell(cellAddress).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            });
        });
        const buf = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buf]), `${fileName}.xlsx`);
        } catch (error) {
        console.error('<<<ERRROR>>>', error);
        console.error('Something Went Wrong', error.message);
        } finally {
        workbook.removeWorksheet(workSheetName);
        }
    };

    useEffect(() => {
        if(sessionData.isLoggedIn==false) Router.push('/signin');
    }, [sessionData]);

    useEffect(() => {
        setType(Cookies.get('type'))
        console.log(adminData)
        setAdminList(adminData)
        setApprovedBy(adminData[0].id)
        if(Object.keys(payRequestData).length>0){
            setRecords(payRequestData)
        }
    }, []);

    const handleSubmit = async(e) => {
        setLoad(true)
        e.preventDefault();
        let loginId = Cookies.get('loginId')
        let username = Cookies.get('username')
        await axios.post(process.env.NEXT_PUBLIC_MAKE_PAYMENT_REQUEST_POST,{
            UserId:loginId,
            reason:reason,
            amount:amount,
            username:username,
            company:company,
            paidTo:paidTo,
            reqBy:reqBy,
            rupees:rupees,
            type:reqType.loan==true?'Loan':reqType.advance==true?'Advance':'Expense'
        }).then((x)=>{
            let tempState = [...records];
            tempState.unshift(x.data);
            setRecords(tempState);
            setLoad(false);
            setVisible(false);
        })
    }

    const handleEdit = async(e) => {
        e.preventDefault();
         setLoad(true)
         let date = moment().format('MMM Do YY, h:mm a');
         let loginId = Cookies.get('loginId')
         let username = Cookies.get('username')
         await axios.post(process.env.NEXT_PUBLIC_EDIT_PAYMENT_REQUEST_POST,{
            id:selectedRequest.id,
            loginId:loginId,
            amount:amount,
            rupees:rupees,
            editedBy:username,
            editedDate:date,
            type:reqType.loan==true?'Loan':reqType.advance==true?'Advance':'Expense'
        }).then((x)=>{
            setLoad(false);
            let tempState = [...records];
            let i = tempState.findIndex((y=>selectedRequest.id==y.id));
            tempState[i].amount = amount;
            tempState[i].rupees = rupees;
            tempState[i].editedBy = username;
            tempState[i].editedDate = date;
            tempState[i].type = reqType.loan==true?'Loan':reqType.advance==true?'Advance':'Expense';
            setRecords(tempState)
        })
    }

    const handleApprove = async(e) => {
        setLoad(true)
        e.preventDefault();
        let date = moment().format('MMM Do YY, h:mm a');
        let loginId = Cookies.get('loginId')
        let username = Cookies.get('username')
        console.log(approvedBy)
        await axios.post(process.env.NEXT_PUBLIC_APPROVE_PAYMENT_REQUEST_POST,{
            approverId:approvedBy, approvedDate:date, id:selectedRequest.id, 
            name:selectedRequest.User.f_name+" "+selectedRequest.User.l_name,
            amount:selectedRequest.amount, type:selectedRequest.type,
            email:selectedRequest.User.email, username:username
        }).then((x)=>{
            let tempState = [...records];
            let i = tempState.findIndex((y=>selectedRequest.id==y.id));
            tempState[i].approverId=approvedBy
            tempState[i].approvedDate=date
            tempState[i].approve=1

            setRecords(tempState);
            setLoad(false);
            setApprove(false);
            
        })
    }

    const getAdminPic = (id) => {
        let url = '';
        adminList.forEach((x)=>{
            if(x.id==id){
                url = x.signature
            }
        })
        return url;
    }

  return (
    <div className={theme=='light'?'lightTheme':'darkTheme'}>
    <Row className='box m-3'>
        <Col md={5}><h3 className='f my-2'>{type!='Admin'?'Your Requests':`Payment Requests ${company}`}</h3></Col>
        <Col style={{textAlign:'right'}}>
        <Row>
            <Col md={11}>{type!='Admin' &&<button className='custom-btn' onClick={()=>setVisible(true)}>Make Request</button>}</Col>
            <Col md={1} className='py-1'>
            <input id={myInputId} defaultValue={company+' Voucher List'} value={company+' Voucher List'} style={{display:'none'}} />
            <Dropdown>
                <Dropdown.Toggle style={{backgroundColor:'rgb(6, 150, 172)', border:'none', borderRadius:25}} id="dropdown-basic">
                </Dropdown.Toggle>
                <Dropdown.Menu className='py-3'>
                    <Form.Check className='mx-3' type="radio" label='Cargo Linkers' checked={company=='Cargo Linkers'} onChange={()=>setCompany('Cargo Linkers')} />
                    <Form.Check className='mx-3' type="radio" label='Sea Net' checked={company=='Sea Net'} onChange={()=>setCompany('Sea Net')} />
                    <Form.Check className='mx-3' type="radio" label='Air Cargo Services' checked={company=='Air Cargo Services'} onChange={()=>setCompany('Air Cargo Services')} />
                    <hr/>
                    <button className='custom-btn mx-5 mt-2' onClick={saveExcel}>Export</button>
                </Dropdown.Menu>
            </Dropdown>
            </Col>
        </Row>
        </Col>
        <div className='px-2'>
        <hr className='my-2' />
        </div>
        <div className='table-sm-1 mt-3'>
        <Table className='tableFixHead'>
            <thead>
            <tr>
                <th>Sr.</th>
                <th>Reason</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Request</th>
                <th>Company</th>
                {type=='Admin' &&<th>Account</th>}
                <th>Edited By</th>
                {type=='Admin' &&<th>Approve</th>}
                <th>Edit</th>
            </tr>
            </thead>
            <tbody>
            {
            records.filter((x)=>{
                return x.company==company
            }).map((x, index) => {
            return (
            <tr key={index} className='f'>
            <td>{index + 1}</td>
            <td style={{color:'grey', fontSize:13, maxWidth:140}}>{x.reason}</td>
            <td>Rs.{x.amount}</td>
            <td>{x.type}</td>
            <td style={{minWidth:120}}>
                {
                x.approve=='0'?
                <span style={{color:'#ed8545', fontWeight:'500'}}>Pending</span>:
                <span style={{color:'#7e9648', fontWeight:'500'}}>
                    Approved<br/><span style={{color:'grey', fontSize:12, fontWeight:400}}>{x.approvedDate}</span>
                </span>
                }
            </td>
            <td style={{color:'grey', fontSize:14, minWidth:150}}>By: {x.reqBy}<br/>To: {x.paidTo}</td>
            <td><b style={{color:'grey'}}>{x.company}</b></td>
            {type=='Admin' && 
            <td>
                <div>{x.User.f_name} {x.User.l_name}</div>
                <div style={{color:'grey',fontSize:12}}>{"("}{x.User.designation}{")"}</div>
            </td>
            }
            <td style={{minWidth:120}}>{x.editedBy}<br/><span style={{color:'grey',fontSize:12}}>{x.editedDate}</span></td>
            {type=='Admin' &&
                <td style={{paddingLeft:30}}>
                <span onClick={()=>{
                    setSelectedRequest(x);
                    setApprove(true);
                }}><CheckCircleOutlined style={{fontSize:20, marginTop:10}} className='modify-edit' /></span>
                </td>
            }
            <td>
                {x.approve!=1 &&<span onClick={()=>{
                    setSelectedRequest(x);
                    console.log(x);
                    setAmount(x.amount)
                    setRupees(x.rupees)
                    setReqType({loan:x.type=="Loan"?true:false, advance:x.type=="Advance"?true:false, expense:x.type=="Expense"?true:false})
                    setEdit(true);
                }}>
                    <EditOutlined style={{fontSize:20, marginTop:10}} className='modify-edit' />
                </span>
                }
                {x.approve==1 && <EditOutlined style={{fontSize:20, marginTop:10, color:'silver'}} />}
                </td>
            </tr>
            )
            })}
            </tbody>
        </Table>
        </div>
    </Row>
    <Modal
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        //width={1000}
        footer={false}
        bodyStyle={{backgroundColor:theme=='light'?'white':'#162A46', borderRadius:1}}
        style={{color:theme=='light'?'black':'white'}}
    >
        <div className={theme=='light'?'lightTheme':'darkTheme'}>
        <h3 className='f'>Make request</h3>
        <hr/>
        <Form className='' onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" value={company} onChange={(e)=>setCompany(e.target.value)}>
            <Form.Label>Company:</Form.Label>
            <Form.Select aria-label="Default select example">
                <option value="Cargo Linkers">Cargo Linkers</option>
                <option value="Sea Net">Sea Net</option>
                <option value="Air Cargo Services">Air Cargo Services</option>
            </Form.Select>
        </Form.Group>
        <Row>
            <Col>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Requested By:</Form.Label>
                <Form.Control type="text" placeholder="Requested By" required value={reqBy} onChange={(e)=>setReqBy(e.target.value)} />
            </Form.Group>
            </Col>
            <Col>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Pay To:</Form.Label>
                <Form.Control type="text" placeholder="Pay To" required value={paidTo} onChange={(e)=>setPaidTo(e.target.value)} />
            </Form.Group>
            </Col>
        </Row>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>On A/C of:</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter Reason" required value={reason} onChange={(e)=>setReason(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Amount:</Form.Label>
            <Form.Control type="number" placeholder="Amount" required value={amount} onChange={(e)=>setAmount(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Amount In Rupees:</Form.Label>
            <Form.Control type="text" placeholder="Amount In rupees" required value={rupees} onChange={(e)=>setRupees(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Type:</Form.Label>
            <Form.Check type="radio" aria-label="loan" label='Loan' checked={reqType.loan} onChange={()=>setReqType({loan:true, advance:false, expense:false})} />
            <Form.Check type="radio" aria-label="advance" label='Advance' checked={reqType.advance} onChange={()=>setReqType({loan:false, advance:true, expense:false})} />
            <Form.Check type="radio" aria-label="expense" label='Expense' checked={reqType.expense} onChange={()=>setReqType({loan:false, advance:false, expense:true})} />
        </Form.Group>
        {(reqType.loan==true || reqType.advance==true || reqType.expense==true) && <button className='custom-btn mt-4' disabled={load?true:false} type="submit">{!load?'Submit':<Spinner animation="border" className='mx-3' size="sm" />}</button>}
        </Form>
        </div>
    </Modal>

    <Modal
        visible={edit}
        onOk={() => setEdit(false)}
        onCancel={() => setEdit(false)}
        //width={1000}
        footer={false}
        bodyStyle={{backgroundColor:theme=='light'?'white':'#162A46', borderRadius:1}}
        style={{color:theme=='light'?'black':'white'}}
    >
        <div className={theme=='light'?'lightTheme':'darkTheme'}>
        <h3 className='f'>Make request</h3>
        <hr/>
        <Form className='' onSubmit={handleEdit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Amount:</Form.Label>
            <Form.Control type="number" placeholder="Amount" required value={amount} onChange={(e)=>setAmount(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Amount In Rupees:</Form.Label>
            <Form.Control type="text" placeholder="Amount In rupees" required value={rupees} onChange={(e)=>setRupees(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Type:</Form.Label>
            <Form.Check type="radio" aria-label="loan" label='Loan' checked={reqType.loan} onChange={()=>setReqType({loan:true, advance:false, expense:false})} />
            <Form.Check type="radio" aria-label="advance" label='Advance' checked={reqType.advance} onChange={()=>setReqType({loan:false, advance:true, expense:false})} />
            <Form.Check type="radio" aria-label="expense" label='Expense' checked={reqType.expense} onChange={()=>setReqType({loan:false, advance:false, expense:true})} />
        </Form.Group>
        {(reqType.loan==true || reqType.advance==true || reqType.expense==true) && <button className='custom-btn mt-4' disabled={load?true:false} type="submit">{!load?'Submit':<Spinner animation="border" className='mx-3' size="sm" />}</button>}
        </Form>
        </div>
    </Modal>

    <Modal 
        visible={approve}
        onOk={() => setApprove(false)}
        onCancel={() => setApprove(false)}
        width={700}
        footer={false}
        bodyStyle={{backgroundColor:theme=='light'?'white':'#162A46', borderRadius:1}}
        style={{color:theme=='light'?'black':'white'}}
    >
        <div className={theme=='light'?'lightTheme':'darkTheme'} >
        <h3 className='f'>Confirmation!</h3>
        <h6 className='f'>Approve This Request?</h6>
        <hr/>
        <Row>
            <Col>
            <h6 className='f'>Date</h6>
            <div>{moment().format('MMM-DD-YYYY, h:mm:ss a')}</div>
            </Col>
            <Col>
            <h6 className='f'>Amount</h6>
            <div>{selectedRequest.amount}</div>
            </Col>
            <Col>
            <h6 className='f'>Amount In Rupees</h6>
            <div>{selectedRequest.rupees}</div>
            </Col>
        </Row>
        <hr/>
        <Row>
            <Col>
            <h6 className='f'>Paid To</h6>
            <div>{selectedRequest.paidTo}</div>
            </Col>
            <Col>
            <h6 className='f'>Requested By</h6>
            <div>{selectedRequest.reqBy} {"("}{selectedRequest.company}{")"}</div>
            </Col>
            <Col>
            <h6 className='f'>Approved By</h6>
            <Form.Select aria-label="" value={selectedRequest.approve==1?selectedRequest.approverId:approvedBy} disabled={selectedRequest.approve==1} onChange={(e)=>setApprovedBy(e.target.value)}>
                {
                    adminList.map((x, index)=>{
                        return(<option key={index} value={x.id}>{x.f_name} {x.l_name}</option>)
                    })
                }
            </Form.Select>
            </Col>
        </Row>
        <hr/>
        <h6 className='f'>ON A/C OF</h6>
        <div style={{whiteSpace:'pre-line'}}>{selectedRequest.reason}</div>
        <hr/>
        <ReactToPrint
            content={() => inputRef }
            trigger={() => <button className="custom-btn mt-4">Print to PDF!</button>}
        />
        {selectedRequest.approve!=1 &&
        <button className='custom-btn mt-4 mx-4' onClick={handleApprove} >
            {!load?'Approve':<Spinner animation="border" className='mx-3' size="sm" />}
        </button>
        }
        </div>
    </Modal>
    <div style={{display:'none'}}>
        <div ref={(response) => (inputRef = response)}>
        <div className='voucher'>
            <div className='text-center'><img src={selectedRequest.company=='Cargo Linkers'?'./assets/cargolinkers-black.png':selectedRequest.company=='Sea Net'?'./assets/seanet-black.png':selectedRequest.company=='Air Cargo Services'?'./assets/seanet-black.png':null} height={100} /></div>
            <div className='text-center' style={{lineHeight:0.02}}>CASH PAYMENT VOUCHER {"("}Company Copy{")"}</div>
            <Row style={{borderBottom:'1px solid silver'}}>
                <Col>
                    <div><b>Voucher No:</b> {selectedRequest.id}</div>
                </Col>
                <Col>
                    <div style={{float:'right'}}><b>Date:</b> {moment().format('MMM-DD-YYYY')}</div>
                </Col>
            </Row>
            <Row style={{borderBottom:'1px solid silver'}}>
                <Col>
                    <div><b>Paid To:</b> {selectedRequest.paidTo}</div>
                </Col>
                <Col>
                    <div style={{float:'right'}}><b>Requested By:</b> {selectedRequest.reqBy}</div>
                </Col>
            </Row>
            <Row style={{borderBottom:'1px solid silver'}}>
                <Col>
                    <div style={{whiteSpace:'pre-line'}}><b>On A/C. OF:</b> <br/>{selectedRequest.reason}</div>
                </Col>
            </Row>
            <Row style={{borderBottom:'1px solid silver'}}>
                <Col>
                    <div><b>Rupees:</b> <br/>{selectedRequest.rupees}</div>
                </Col>
                <Col>
                    <div style={{float:'right'}}><b>Amount:</b> <br/> Rs. {selectedRequest.amount}</div>
                </Col>
            </Row>
            <Row style={{marginTop:10}}>
                <Col className='text-start'>
                    {Cookies.get('signature')==''&&<div style={{height:90}}></div>}
                    {Cookies.get('signature')!=''&&<img src={Cookies.get('signature')} height={90} />}
                    <div className=''>Prepared By</div>
                </Col>
                <Col className='text-center'>
                    {selectedRequest.approve==1 && 
                        <>
                            {getAdminPic(selectedRequest.approverId)==''&&<div style={{height:90}}></div>}
                            {getAdminPic(selectedRequest.approverId)!=''&&<img src={getAdminPic(selectedRequest.approverId)} height={90} />}
                        </>
                    }
                    {selectedRequest.approve!=1 && 
                        <>
                            {getAdminPic(approvedBy)==''&&<div style={{height:90}}></div>}
                            {getAdminPic(approvedBy)!=''&&<img src={getAdminPic(approvedBy)} height={90} />}
                        </>
                    }
                    <div>Approved By</div>
                </Col>
                <Col className='text-end'>
                    <div style={{height:90}}></div>
                    <div>Received By</div>
                </Col>
            </Row>
        </div>
        <div className='voucher'>
            <div className='text-center'><img src={selectedRequest.company=='Cargo Linkers'?'./assets/cargolinkers-black.png':selectedRequest.company=='Sea Net'?'./assets/seanet-black.png':selectedRequest.company=='Air Cargo Services'?'./assets/seanet-black.png':null} height={100} /></div>
            <div className='text-center' style={{lineHeight:0.02}}>CASH PAYMENT VOUCHER {"("}Candidate Copy{")"}</div>
            <Row style={{borderBottom:'1px solid silver'}}>
                <Col>
                    <div><b>Voucher No:</b> {selectedRequest.id}</div>
                </Col>
                <Col>
                    <div style={{float:'right'}}><b>Date:</b> {moment().format('MMM-DD-YYYY')}</div>
                </Col>
            </Row>
            <Row style={{borderBottom:'1px solid silver'}}>
                <Col>
                    <div><b>Paid To:</b> {selectedRequest.paidTo}</div>
                </Col>
                <Col>
                    <div style={{float:'right'}}><b>Requested By::</b> {selectedRequest.reqBy}</div>
                </Col>
            </Row>
            <Row style={{borderBottom:'1px solid silver'}}>
                <Col>
                    <div style={{whiteSpace:'pre-line'}}><b>On A/C. OF:</b> <br/>{selectedRequest.reason}</div>
                </Col>
            </Row>
            <Row style={{borderBottom:'1px solid silver'}}>
                <Col>
                    <div><b>Rupees:</b> <br/>{selectedRequest.rupees}</div>
                </Col>
                <Col>
                    <div style={{float:'right'}}><b>Amount:</b> <br/> Rs. {selectedRequest.amount}</div>
                </Col>
            </Row>
            <Row style={{marginTop:10}}>
                <Col className='text-start'>
                    {Cookies.get('signature')==''&&<div style={{height:90}}></div>}
                    {Cookies.get('signature')!=''&&<img src={Cookies.get('signature')} height={90} />}
                    <div className=''>Prepared By</div>
                </Col>
                <Col className='text-center'>
                    {selectedRequest.approve==1 && 
                        <>
                            {getAdminPic(selectedRequest.approverId)==''&&<div style={{height:90}}></div>}
                            {getAdminPic(selectedRequest.approverId)!=''&&<img src={getAdminPic(selectedRequest.approverId)} height={90} />}
                        </>
                    }
                    {selectedRequest.approve!=1 && 
                        <>
                            {getAdminPic(approvedBy)==''&&<div style={{height:90}}></div>}
                            {getAdminPic(approvedBy)!=''&&<img src={getAdminPic(approvedBy)} height={90} />}
                        </>
                    }
                    <div>Approved By</div>
                </Col>
                <Col className='text-end'>
                    <div style={{height:90}}></div>
                    <div>Received By</div>
                </Col>
            </Row>
        </div>
        </div>
    </div>
    </div>
  )
}

export default PaymentReq