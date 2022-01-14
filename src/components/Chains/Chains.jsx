import { useEffect, useState } from "react";
import useChain from "hooks/useChain";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { AvaxLogo, PolygonLogo, BSCLogo, ETHLogo, FantomLogo } from "./Logos";

const styles = {
  item: {
    display: "flex",
    alignItems: "center",
    height: "42px",
    fontWeight: "500",
    fontFamily: "Roboto, sans-serif",
    fontSize: "14px",
    padding: "0 10px",
  },
  button: {
    border: "2px solid rgb(231, 234, 243)",
    borderRadius: "12px",
  },
};

const menuItems = [
  {
     key: "0x3",
     value: "Ropsten Testnet",
     icon: <ETHLogo />,
  },
  {
    key: "0x4",
     value: "Rinkeby Testnet",
     icon: <ETHLogo />,
   },
   {
     key: "0x2a",
     value: "Kovan Testnet",
     icon: <ETHLogo />,
   },
  {
     key: "0x5",
     value: "Goerli Testnet",
     icon: <ETHLogo />,
   },
  //{
  //  key: "0x1",
  //  value: "Ethereum mainnet",
  //  icon: <ETHLogo />,
  //},

   {
     key: "0x61", // 97
     value: "Binance Smart Chain Testnet",
     icon: <BSCLogo />,
   },
   //{
   //  key: "0x38", // 56
   //  value: "Binance mainnet",
   //  icon: <BSCLogo />,
   //},

   {
    key: "0x13881", // 80001
    value: "Polygon Mumbai testnet",
    icon: <PolygonLogo />,
  },
   //{
   //  key: "0x89", // 137
   //  value: "Polygon mainnet",
   //  icon: <PolygonLogo />,
   //},

   {
     key: "0xa869", // 43113
     value: "Avalanche Fuji testnet",
     icon: <AvaxLogo />,
   },
  //{
  //   key: "0xa86a", // 43114
  //   value: "Avalanche mainnet",
  //   icon: <AvaxLogo />,
  // },

  {
     key: "0xFA2", // 4002
     value: "Fantom testnet",
     icon: <FantomLogo />,
   },
   //{
   //  key: "0xFA", // 250
   //  value: "Fantom Opera mainnet",
   //  icon: <FantomLogo />,
   //},

  // {
  //   key: "0x539",
  //   value: "Local Chain",
  //   icon: <ETHLogo />,
  // },
];

function Chains() {
  const { switchNetwork } = useChain();
  const { chainId } = useMoralisDapp();
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (!chainId) return null;
    const newSelected = menuItems.find((item) => item.key === chainId);
    setSelected(newSelected);
    console.log("current chainId: ", chainId);
  }, [chainId]);

  const handleMenuClick = (e) => {
    console.log("switch to: ", e.key);
    switchNetwork(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {menuItems.map((item) => (
        <Menu.Item key={item.key} icon={item.icon} style={styles.item}>
          <span style={{ marginLeft: "5px" }}>{item.value}</span>
        </Menu.Item>
      ))}
    </Menu> 
  );

  return (
    <div>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button
          key={selected?.key}
          icon={selected?.icon}
          style={{ ...styles.button, ...styles.item }}
        >
          <span style={{ marginLeft: "5px" }}>{selected?.value}</span>
          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
}

export default Chains;
