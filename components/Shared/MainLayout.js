import { TeamOutlined, AlignLeftOutlined, UserOutlined, ProfileOutlined, SolutionOutlined, ForkOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { CgDarkMode } from "react-icons/cg";
import { BiBarcodeReader } from "react-icons/bi";
import Router,{ useRouter } from 'next/router';
import Link from 'next/link';

import { useSelector, useDispatch } from 'react-redux'
import { light, dark } from '/redux/features/themeSlice';
  
  const { Header, Sider, Content } = Layout;
  
  const MainLayout = ({children}) => {
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(true);
    const [permissions, setPermissions] = useState(
      {
        f1:  "0",
        f2:  "0",
        f3:  "0",
        f4:  "0",
        f5:  "0",
        f6:  "0",
        f7:  "0",
        f8:  "0",
        f9:  "0",
        f10: "0",
        f11: "0",
        f12: "0",
        f13: "0",
        f14: "0",
        f15: "0",
        f16: "0",
        f17: "0",
        f18: "0",
        f19: "0",
        f20: "0"
      }
    );
    const theme = useSelector((state) => state.theme.value)
    const dispatch = useDispatch();
    
    const values = () => {
      let value = '1';
        if(router.pathname === '/dashboard'){ value='1' }
        else if(router.pathname === '/clients'){ value='2' }
        else if(router.pathname === '/shipments'){ value='3' }
        else if(router.pathname === '/maps'){ value='4' }
        else if(router.pathname === '/users'){ value='5' }
        else { value='null' }
      return value
    }
    const [keys, setKeys] = useState(values());
    
    useEffect(() => {
      if(Cookies.get('theme')===undefined){
        Cookies.set('theme','light')
      }else if(Cookies.get('theme')==='dark'){
        dispatch(dark())
      }else if(Cookies.get('theme')==='light'){
        dispatch(light())
      }
      //console.log(theme)
    }, [Cookies.get('theme')]);
    
    useEffect(() => {
      let perms = Cookies.get('permissions')
      console.log(perms)
      if(perms!=undefined){
        setPermissions(JSON.parse(Cookies.get('permissions')))
      }
    }, [])
    
    return (
      <Layout className='layoutStyles'>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <span className={'darkTheme headr-icon'}>
            {React.createElement(collapsed ? AlignLeftOutlined : AlignLeftOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
            </span>
            <Menu className='' style={{paddingTop:15}} theme="dark" mode="inline" defaultSelectedKeys={[keys]}>
            
            <Menu.Item key="1" icon={<ProfileOutlined />}>
              <Link href="/dashboard"><a style={{textDecoration:'none'}}>Dashboard</a></Link>
            </Menu.Item>
            {// permissions.f2=='1'&&
            <Menu.Item key="2" icon={<TeamOutlined />}>
              <Link href="/clients"><a style={{textDecoration:'none'}}>Clients</a></Link>
            </Menu.Item>
            }
            { permissions.f2=='1'&&
            <Menu.Item key="3" icon={<SolutionOutlined />}>
              <Link href="/shipments"><a style={{textDecoration:'none'}}>Shipments</a></Link>
            </Menu.Item>
            }
            { permissions.f3=='1'&&
            <Menu.Item key="4" icon={<ForkOutlined />}>
              <Link href="/maps"><a style={{textDecoration:'none'}}>Live Tracking</a></Link>
            </Menu.Item>
            }
            { permissions.f4=='1'&&
            <Menu.Item key="5" icon={<UserOutlined />}>
              <Link href="/users"><a style={{textDecoration:'none'}}>Users</a></Link>
            </Menu.Item>
            }
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{backgroundColor:'grey'}}>
          <Header className={'dark-bg'}
          style={{ padding: 0}}>
            <span className='darkTheme f-25 mx-3'><img src="/assets/logotwo.png" height={40} style={{marginBottom:7}} alt="logo" /></span>
            <span className={'darkTheme mx-3'} style={{float:'right', marginRight:10, cursor:'pointer'}}>
              <CgDarkMode onClick={()=>{
                if(theme=='dark'){
                  dispatch(light()); Cookies.set('theme','light')
                }else if(theme=='light'){
                  dispatch(dark()); Cookies.set('theme','dark')
                }
              }}/>
            </span>
            <span className='darkTheme' style={{float:'right', marginRight:10, padding:1, cursor:'pointer'}}
              onClick={()=>{
                Cookies.remove('token');
                Cookies.remove('username');
                Cookies.remove('loginId');
                Cookies.remove('type');
                Cookies.remove('permissions');
                Router.push('/signin')
              }}
            >
                <LogoutOutlined style={{marginBottom:3, marginRight:5, fontSize:20}} />
                <span style={{position:'relative', top:3}}>Sign Out</span>
            </span>
          </Header>
          <Content className={theme==='light'?'light-bg':'dark-bg'}
            style={{
              margin: '1px 0px 0px 1px',
              padding: 24, minHeight: 280,
              backgroundColor:theme==='light'?'#f0f2f5':'rgb(0 21 41)'
            }}
          > 
          <div className={theme==='light'?'lightTheme':'darkTheme'}>
            {children}
          </div>
          </Content>
        </Layout>
      </Layout>
    );
  };
export default MainLayout;