import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';

import { Row, Col, Table } from 'react-bootstrap';
import { Modal, Dropdown, Menu, Space } from 'antd';

import { CloseCircleOutlined, EditOutlined, InfoCircleOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';

import Link from 'next/link';

import moment from 'moment'

import axios from 'axios';
import Router from 'next/router'

const Bills = ({shipmentData, sessionData}) => {

    const [bills, setBills] = useState([]);
    const [ visible, setVisible ] = useState(false);
    const theme = useSelector((state) => state.theme.value);

    useEffect(() => {
        if(sessionData.isLoggedIn==false){
          Router.push('/signin')
        }
    }, [sessionData]);

    useEffect(() => {
        setBills(shipmentData)
    }, [])

  return (
    <div>
      <div className={theme=='light'?'lightTheme':'darkTheme'}>
        <Row className='box m-3'>
          <Col><h3 className='f my-2'>Bills</h3></Col>
          <div className='px-2'>
          <hr className='my-2' />
          </div>
          <div className='table-sm-1 mt-3'>
              <Table className='tableFixHead'>
              <thead>
                <tr className='text-center'>
                  <th>Sr.</th>
                  <th>Name</th>
                  <th>Consignment</th>
                  <th>Container No.</th>
                  <th>Terminal</th>
                  <th>GD no.</th>
                </tr>
              </thead>
              <tbody>
              {
              bills.map((x, index) => {
              return (
              <tr key={index} className='f text-center row-hover'>
                <td>{index + 1}</td>
                <td>{x.Client.name}</td>
                <td>{x.consignment}</td>
                <td>{x.container}</td>
                <td>{x.terminal}</td>
                <td>{x.gd}</td>
              </tr>
                )
              })}
              </tbody>
              </Table>
          </div>
        </Row>
      </div>
    </div>
  )
}

export default Bills