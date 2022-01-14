import { useEffect, useState} from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import Account from "components/Account";
import Chains from "components/Chains";
import NFTBalance from "components/NFTBalance";
import NFTTokenIds from "components/NFTTokenIds";
import { Menu, Layout, Tabs} from "antd";
import SearchCollections from "components/SearchCollections";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
import Text from "antd/lib/typography/Text";
import NFTMarketTransactions from "components/NFTMarketTransactions";
import SubMenu from "antd/lib/menu/SubMenu";
import QuickStart from "components/QuickStart";
import Contract from "components/Contract/Contract";
import Ramper from "components/Ramper";
import Wallet from "components/Wallet";
import ERC20Balance from "components/ERC20Balance";
import ERC20Transfers from "components/ERC20Transfers";
import DEX from "components/DEX";

const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();



  const [inputValue, setInputValue] = useState("explore");

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <LogoRestocks />
          <SearchCollections setInputValue={setInputValue}/>
          <Menu
            theme="light"
            mode="horizontal"
            style={{
              display: "flex",
              fontSize: "17px",
              fontWeight: "500",
              marginLeft: "50px",
              width: "100%",
            }}
            defaultSelectedKeys={["nftMarket"]}
          >
            <SubMenu title="General" key="general">
              <Menu.Item key="/quickstart">
                <NavLink to="/quickstart">🚀 Quick Start</NavLink>
              </Menu.Item>
              <Menu.Item key="/wallet">
                <NavLink to="/wallet">👛 Wallet</NavLink>
              </Menu.Item>
              <Menu.Item key="/1inch">
                <NavLink to="/1inch">🏦 Dex</NavLink>
              </Menu.Item>
              <Menu.Item key="/onramp">
                <NavLink to="/onramp">💵 Fiat</NavLink>
              </Menu.Item>
              <Menu.Item key="/erc20balance">
                <NavLink to="/erc20balance">💰 Balances</NavLink>
              </Menu.Item>
              <Menu.Item key="/erc20transfers">
                <NavLink to="/erc20transfers">💸 Transfers</NavLink>
              </Menu.Item>
              <Menu.Item key="/contract">
                <NavLink to="/contract">📄 Contract</NavLink>
              </Menu.Item>
            </SubMenu>
            <SubMenu title="NFT" key="nft">
              <Menu.Item key="/NFTMarketPlace" onClick={() => setInputValue("explore")} >
                <NavLink to="/NFTMarketPlace">🛒 Explore Market</NavLink>
              </Menu.Item>
              <Menu.Item key="/nftBalance">
                <NavLink to="/nftBalance">🖼 Your Collection</NavLink>
              </Menu.Item>
              <Menu.Item key="transactions">
                <NavLink to="/transactions">📑 Your Transactions</NavLink>
              </Menu.Item>
            </SubMenu>
          </Menu>
          <div style={styles.headerRight}>
            <Chains />
            <NativeBalance />
            <Account />
          </div>
        </Header>
        <div style={styles.content}>
          <Switch>
            <Route exact path="/quickstart">
              <QuickStart isServerInfo={isServerInfo} />
            </Route>
            <Route path="/wallet">
              <Wallet />
            </Route>
            <Route path="/1inch">
              <Tabs defaultActiveKey="1" style={{ alignItems: "center" }}>
                <Tabs.TabPane tab={<span>Ethereum</span>} key="1">
                  <DEX chain="eth" />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>Binance Smart Chain</span>} key="2">
                  <DEX chain="bsc" />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>Polygon</span>} key="3">
                  <DEX chain="polygon" />
                </Tabs.TabPane>
              </Tabs>
            </Route>
            <Route path="/erc20balance">
              <ERC20Balance />
            </Route>
            <Route path="/onramp">
              <Ramper />
            </Route>
            <Route path="/erc20transfers">
              <ERC20Transfers />
            </Route>
            <Route path="/contract">
              <Contract />
            </Route>
            <Route path="/nftBalance">
              <NFTBalance />
            </Route>
            <Route path="/NFTMarketPlace">
              <NFTTokenIds inputValue={inputValue} setInputValue={setInputValue}/>
            </Route>
            <Route path="/transactions">
              <NFTMarketTransactions />
            </Route>
            <Route path="/ethereum-boilerplate">
              <Redirect to="/quickstart" />
            </Route>
            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>
            <Route path="/">
              <Redirect to="/quickstart" />
            </Route>
          </Switch>
          <Redirect to="/NFTMarketPlace" />
        </div>
      </Router>
      <Footer style={{ flex: 1, flexDirection: 'row' }}>
        <div style= {{ flex: 1, flexDirection: 'column', alignItems: 'center', paddingLeft: 0 }}>
          <LogoMoralis />
          <Text style={{ display: "block", textAlign: "center" }}>
            powered by {" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://moralis.io"
            >
              Moralis
            </a>
          </Text>
          <Text style={{ display: "block", textAlign: "center" }}>
            created by {" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://dAppIT.nl"
            >
              dAppIT
            </a>
          </Text>
        </div>
      </Footer>
    </Layout>
  );
};

export const LogoRestocks = () => (
  <div style={{ display: "flex" }}>
    <svg width="337" height="42" viewBox="0 0 337 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40.5506 40.6871L33.5832 27.7497C36.8811 25.406 39.25 21.6561 39.25 16.3592C39.25 5.99995 33.1651 1.31249 22.3423 1.31249H0V40.6871H12.8666V30.5153H22.621L27.9163 40.6871H40.5506ZM12.8666 12.0936H21.4598C24.7113 12.0936 26.3834 13.6874 26.3834 16.453C26.3834 19.2186 24.7113 20.8123 21.4598 20.8123H12.8666V12.0936Z" fill="#181818" />
      <path d="M43.4595 40.6871H78.622V30.281H56.3261V25.2654H77.7859V16.7342H56.3261V11.7186H78.622V1.31249H43.4595V40.6871Z" fill="#181818" />
      <path d="M100.818 41.9996C114.195 42.0465 120.791 37.7809 120.791 29.2029C120.791 18.4217 110.154 18.1873 102.397 16.8748L98.2629 16.1717C95.2902 15.703 94.5934 14.3436 94.5934 13.2186C94.5934 11.4374 96.3585 10.1249 100.632 10.1249C105.556 10.1249 107.739 11.7655 108.203 14.3905H119.676C119.909 3.1406 112.105 0 100.911 0C88.5085 0 82.2378 4.78121 82.2378 12.5624C82.2378 22.6404 91.1097 23.531 98.4952 24.7498L103.512 25.5466C107.321 26.1091 108.017 27.4216 108.017 28.6872C108.017 30.5154 105.741 31.9216 100.818 31.8747C95.2437 31.8278 93.0141 30.1872 92.8748 27.5154H81.3088C80.9836 37.734 87.3473 41.9527 100.818 41.9996Z" fill="#181818" />
      <path d="M162.849 1.31249H121.927V12.1405H135.955V40.6871H148.821V12.1405H162.849V1.31249Z" fill="#181818" />
      <path d="M232.32 41.9996C241.935 41.9996 251.596 37.7809 252.897 24.3748H240.634C239.566 28.781 236.547 30.7966 232.32 30.7966C227.21 30.7966 223.169 26.9529 223.169 20.9998C223.169 15.0467 227.21 11.203 232.32 11.203C236.547 11.203 239.566 13.2186 240.634 17.5311H252.897C251.596 4.21871 241.842 0 232.32 0C219.174 0 210.395 8.39055 210.395 20.9998C210.395 33.6091 219.174 41.9996 232.32 41.9996Z" fill="#181818" />
      <path d="M298.352 40.6871L282.001 18.8436L297.841 1.31249H283.534L269.46 16.9217H268.624V1.31249H255.804V40.6871H268.624V32.4372L273.966 26.6716H274.802L285.206 40.6871H298.352Z" fill="#181818" />
      <path d="M317.027 41.9996C330.404 42.0465 337 37.7809 337 29.2029C337 18.4217 326.363 18.1873 318.606 16.8748L314.472 16.1717C311.499 15.703 310.802 14.3436 310.802 13.2186C310.802 11.4374 312.567 10.1249 316.841 10.1249C321.764 10.1249 323.948 11.7655 324.412 14.3905H335.885C336.117 3.1406 328.314 0 317.12 0C304.717 0 298.447 4.78121 298.447 12.5624C298.447 22.6404 307.319 23.531 314.704 24.7498L319.721 25.5466C323.53 26.1091 324.226 27.4216 324.226 28.6872C324.226 30.5154 321.95 31.9216 317.027 31.8747C311.453 31.8278 309.223 30.1872 309.084 27.5154H297.518C297.193 37.734 303.556 41.9527 317.027 41.9996Z" fill="#181818" />
      <path d="M207.672 20.9998C207.672 33.6091 198.986 41.9996 185.562 41.9996C172.138 41.9996 163.452 33.6091 163.452 20.9998C163.452 8.39055 172.138 0 185.562 0C189.009 0 192.143 0.55316 194.899 1.58886L189.832 12.1405C188.548 11.5235 187.095 11.203 185.562 11.203C180.453 11.203 176.226 14.7655 176.226 20.9998C176.226 27.2341 180.453 30.7966 185.562 30.7966C190.672 30.7966 194.899 27.2341 194.899 20.9998C194.899 19.7113 194.718 18.537 194.387 17.4846L204.263 8.88352C204.263 8.88352 207.672 14.3205 207.672 20.9998Z" fill="#181818" />
    </svg>
  </div>
);

export const LogoMoralis = () => (
  <div style={{ display: "block", textAlign: "center"}}>
    <svg
      width="60"
      height="38"
      viewBox="0 0 50 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M43.6871 32.3986C43.5973 32.4884 43.53 32.5782 43.4402 32.6905C43.53 32.6007 43.5973 32.5109 43.6871 32.3986Z"
        fill="black"
      />
      <path
        d="M49.7037 14.3715C49.5241 6.2447 42.7891 -0.17592 34.6624 0.00367768C31.0031 0.0934765 27.4784 1.53026 24.8294 4.06708C22.113 1.46291 18.4986 0.00367768 14.727 0.00367768C6.71246 0.00367768 0.202047 6.49164 0 14.5511V14.6633C0 20.8146 2.24497 26.2698 4.26545 30.0189C5.11853 31.5904 6.08387 33.117 7.13901 34.5762C7.5431 35.115 7.8574 35.564 8.10435 35.8559L8.39619 36.2151L8.48599 36.3273L8.50844 36.3498L8.53089 36.3722C10.2146 38.3253 13.1555 38.5498 15.1087 36.8886C15.1311 36.8661 15.1536 36.8437 15.176 36.8212C17.1291 35.0701 17.3312 32.0843 15.625 30.1087L15.6026 30.0638L15.423 29.8618C15.2658 29.6597 15.0189 29.3455 14.727 28.9414C13.9188 27.8189 13.178 26.6515 12.5269 25.4392C10.8881 22.4309 9.42888 18.6145 9.42888 14.7531C9.49623 11.8347 11.9432 9.52236 14.8617 9.58971C17.7128 9.65705 19.9802 11.9694 20.0251 14.8205C20.0476 15.5389 20.2272 16.2348 20.5415 16.8859C21.4844 19.3104 24.2232 20.5227 26.6478 19.5798C28.4438 18.8839 29.6336 17.1553 29.6561 15.2246V14.596C29.7683 11.6775 32.2153 9.38766 35.1562 9.47746C37.94 9.56726 40.1625 11.8122 40.2748 14.596C40.2523 17.6941 39.2645 20.7472 38.1421 23.1718C37.6931 24.1371 37.1992 25.08 36.6379 25.978C36.4359 26.3147 36.2787 26.5617 36.1665 26.6964C36.1216 26.7862 36.0767 26.8311 36.0542 26.8535L36.0318 26.876L35.9869 26.9433C37.6033 24.9004 40.5442 24.5412 42.5871 26.1576C44.4953 27.6617 44.9443 30.3781 43.6198 32.4211L43.6422 32.4435V32.3986L43.6647 32.3762L43.732 32.2864C43.7769 32.1966 43.8667 32.1068 43.9565 31.9721C44.1361 31.7027 44.3606 31.3435 44.6525 30.8945C45.3933 29.6822 46.0668 28.4026 46.673 27.1229C48.1097 24.0249 49.6812 19.5349 49.6812 14.5286L49.7037 14.3715Z"
        fill="#041836"
      />
      <path
        d="M39.7135 25.1249C37.1094 25.1025 34.9991 27.2127 34.9766 29.8169C34.9542 32.4211 37.0645 34.5313 39.6686 34.5538C41.1503 34.5538 42.5647 33.8578 43.4626 32.6905C43.53 32.6007 43.5973 32.4884 43.6871 32.3986C45.1015 30.221 44.4729 27.3025 42.2953 25.9107C41.532 25.3943 40.634 25.1249 39.7135 25.1249Z"
        fill="#B7E803"
      />
    </svg>
  </div>
);

export default App;
