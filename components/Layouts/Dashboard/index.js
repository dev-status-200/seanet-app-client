import React, {useState, useEffect} from 'react'
import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official'


if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
}

const Dashboard = ({orderData}) => {

    const theme = useSelector((state) => state.theme.value);
    const [graphValues, setGraphValues] = useState({ 
        pending:0.0, gdSubmitted:0.0, moveToPort:0.0, passIssued:0.0, passIn:0.0, markForAss:0.0,
        markForExam:0.0, markForANF:0.0, markForDec:0.0, loadAllowde:0.0, onVessel:0.0
    });

    useEffect(() => {
        if(orderData.length>0){ createDataStream(orderData) }
    }, [])

    const createDataStream = (values) => {
        //console.log(values)
        let perc = 100/(values.length)
        let tempState = {
            pending:0.0, gdSubmitted:0.0, moveToPort:0.0, passIssued:0.0, passIn:0.0, markForAss:0.0,
            markForExam:0.0, markForANF:0.0, markForDec:0.0, loadAllowde:0.0, onVessel:0.0,  
        }
        console.log(perc)
        values.forEach(x => {
            //console.log(x.status)
            switch(x.status){
                case '':
                    tempState.pending=tempState.pending+perc
                  break;
                case 'GD Submitted':
                    tempState.gdSubmitted=tempState.gdSubmitted+perc
                  break;
                case 'Consignment Moved to Port':
                    tempState.moveToPort=tempState.moveToPort+perc
                  break;
                case 'Gate Pass Issued':
                    tempState.passIssued=tempState.passIssued+perc
                  break;
                case 'Pass In':
                    tempState.passIn=tempState.passIn+perc
                  break;
                case 'Mark For Assessment':
                    tempState.markForAss=tempState.markForAss+perc
                  break;
                case 'Mark For Exam':
                    tempState.markForExam=tempState.markForExam+perc
                  break;
                case 'Mark For Anc':
                    tempState.markForANF=tempState.markForANF+perc
                  break;
                case 'Mark For Dec':
                    tempState.markForDec=tempState.markForDec+perc
                  break;
                case 'Loading Allowed':
                    tempState.loadAllowde=tempState.loadAllowde+perc
                  break;
                case 'On Vessel':
                    tempState.onVessel=tempState.onVessel+perc
                  break;
              }
        });
        console.log(tempState)
        setGraphValues(tempState)

    }
    const options = {
        
        title: {
            text: ''
        },
        chart: {
            backgroundColor: 'none',
        },
        plotOptions: {
            
            pie: {
            
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.2f} %'
            },
            colors: [
                '#B4B4B4',
                '#E2E2E2',
                '#63B6CC',
                '#1FA5CA',
                '#1F9DCA',
                '#1782CE',
                '#1F52CE',
                '#324EEC',
                '#503EEA',
                '#34C18D',
                '#1DC171',
            ],
            
            }
        },
        series: [{
            name: 'Status',
            colorByPoint: true,
            data: [
            {
                name: 'Pending',
                y: graphValues.pending,
            },
            {
                name: 'GD Submitted',
                y: graphValues.gdSubmitted,
            },
            {
                name: 'Move To Port',
                y: graphValues.moveToPort,
            },
            {
                name: 'Gate Pass Issued',
                y: graphValues.passIssued,
            },
            {
                name: 'Pass In',
                y: graphValues.passIn,
            },
            {
                name: 'Mark For Assessment',
                y: graphValues.markForAss,
            },
            {
                name: 'Mark For Exam',
                y: graphValues.markForExam,
            },
            {
                name: 'Mark For ANF',
                y: graphValues.markForANF,
            },
            {
                name: 'Mark For DEC',
                y: graphValues.markForDec,
            },
            {
                name: 'Loading Allowed',
                y: graphValues.loadAllowde,
            },
            {
                name: 'On Vessel',
                y: graphValues.onVessel,
                sliced: true,
                selected: true
            },
            ],
            type:'pie',
            
        }],
        // exporting: {
        //     chartOptions: {
        //       title: {
        //         text: 'export title'
        //       },
              
        //     }
        //   }
    };
    const optionsTwo = {
        
        title: {
            text: ''
        },
        chart: {
            backgroundColor: 'none',
        },
        plotOptions: {
            
            pie: {
            
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.2f} %'
            },
            colors: [
                '#C14A1D',
                '#DE2C03',
                '#DA2F1F',
                '#911105',
            ],
            
            }
        },
        series: [{
            name: 'Status',
            colorByPoint: true,
            data: [
            {
                name: 'Orders Not Arrived',
                y: 30.0,
            },
            {
                name: 'Custom Clearance Issue',
                y: 39.0,
            },
            {
                name: 'Over Weight',
                y: 26.0,
            },
            {
                name: 'Other',
                y: 14.0,
            },
            ],
            type:'pie',
            
        }],
        // exporting: {
        //     chartOptions: {
        //       title: {
        //         text: 'export title'
        //       },
              
        //     }
        //   }
    };
  return (
    <div className={theme=='light'?'lightTheme':'darkTheme'}>
    <Row className='box m-3' style={{maxHeight:650, overflowX:'auto'}}>
        <Col><h3 className='f my-2'>Dashboard</h3></Col>
        <div className='px-2'>
            <hr className='my-2' />
        </div>
        <Col md={12} className='my-3'>
            <h6 className='f'>Total Orders</h6>
            <h1 className='f'>{orderData.length}</h1>
        </Col>
        <Col md={12}>
            <HighchartsReact highcharts={Highcharts}  options={options} />
        </Col>
        <hr className='my-3' />
        <Col md={12} className='my-3'>
            <h6 className='f'>Orders Blocked !</h6>
            <h1 className='f'>11</h1>
        </Col>
        <Col md={12}>
            <HighchartsReact highcharts={Highcharts}  options={optionsTwo} />
        </Col>
    </Row>
    </div>
  )
}

export default Dashboard
