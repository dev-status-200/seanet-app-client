import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap'
import ReactToPrint from 'react-to-print';
import Barcode from "react-barcode";
import { useSelector } from 'react-redux';

const ShowInfo = ({view}) => {
    const inputRef = useRef(null);
    const theme = useSelector((state) => state.theme.value);

    useEffect(() => {
        console.log(view)
    }, [])

  return (
    <div className={theme=='light'?'lightTheme':'darkTheme'}>
        <Row className='mt-4'>
            <Col md={6} xs={12}>
            <div className='m-3'>
                <span className='heading-font'>	Invoice No :</span>
                <span className='heading-font-thin' style={{float:'right'}}>{view.invoice}</span>
                <hr/>
                <span className='heading-font'>Job No :</span>
                <span className='heading-font-thin' style={{float:'right'}}>{view.job}</span>
                <hr/>
                <span className='heading-font'>Machine No :</span>
                <span className='heading-font-thin' style={{float:'right'}}>{view.machineNo}</span>
                <hr/>
                <span className='heading-font'>Balance :</span>
                <span className='heading-font-thin' style={{float:'right'}}>Rs.{view.balance}</span>
            </div>
            </Col>
            <Col className='m-3' style={{border:'1px solid silver'}}>
            <div className='d-flex mt-5 align-items-center justify-content-center'
                ref={(response) => (inputRef = response)}>
                <Barcode value={view.code}/>
            </div>
            <div className='d-flex my-3 align-items-center justify-content-center'>
                <ReactToPrint
                    content={() =>inputRef}
                    trigger={() => <button className="custom-btn mt-1">Print to PDF!</button>}
                />
            </div>
            </Col>
        </Row>
    </div>
  )
}

export default ShowInfo