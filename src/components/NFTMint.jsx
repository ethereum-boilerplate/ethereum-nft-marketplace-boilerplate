import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { Card, Image, Tooltip, Modal, Input, Alert, Spin, Button } from "antd";
import {
    Form,
    Select,
    InputNumber,
    Switch,
    Radio,
    Slider,
    Upload,
    Rate,
    Checkbox,
    Row,
    Col,
  } from 'antd';
import { useNFTBalance } from "hooks/useNFTBalance";
import { FileSearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import "./styles.css";

const { Meta } = Card;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const normFile = (e) => {
  console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    margin: "0 auto",
    maxWidth: "1200px",
    gap: "10px",
  },
  Title: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1200px",
    gap: "10px",
  },
};

function NFTMint() {
  const { NFTBalance, fetchSuccess } = useNFTBalance();
  const { chainId, marketAddress, contractABI } = useMoralisDapp();
  const { Moralis } = useMoralis();
  const [visible, setVisibility] = useState(false);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  const contractABIJson = JSON.parse(contractABI);
  const listItemFunction = "createMarketItem";
  const ItemImage = Moralis.Object.extend("ItemImages");

  async function list(nft, listPrice) {
    setLoading(true);
    const p = listPrice * ("1e" + 18);
    const ops = {
      contractAddress: marketAddress,
      functionName: listItemFunction,
      abi: contractABIJson,
      params: {
        nftContract: nft.token_address,
        tokenId: nft.token_id,
        price: String(p),
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("success");
        setLoading(false);
        setVisibility(false);
        addItemImage();
        succList();
      },
      onError: (error) => {
        setLoading(false);
        failList();
      },
    });
  }


  async function approveAll(nft) {
    setLoading(true);  
    const ops = {
      contractAddress: nft.token_address,
      functionName: "setApprovalForAll",
      abi: [{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"}],
      params: {
        operator: marketAddress,
        approved: true
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("Approval Received");
        setLoading(false);
        setVisibility(false);
        succApprove();
      },
      onError: (error) => {
        setLoading(false);
        failApprove();
      },
    });
  }

  const handleSellClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };

  function succList() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Your NFT was listed on the marketplace`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function succApprove() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Approval is now set, you may list your NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failList() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem listing your NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failApprove() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem with setting approval`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function addItemImage() {
    const itemImage = new ItemImage();

    itemImage.set("image", nftToSend.image);
    itemImage.set("nftContract", nftToSend.token_address);
    itemImage.set("tokenId", nftToSend.token_id);
    itemImage.set("name", nftToSend.name);

    itemImage.save();
  }

  const [img, setImg] = useState(null);
  console.log(img);



  function preview() {
      if (img==null) {
        return <div>
            <div class="preview-box" style={{paddingTop: "25%"}}>
                <span style={{color: "whitesmoke"}}>Upload a file to see a preview</span>
            </div>
        </div>
      }
        return <div>
            {img && (
                <div class="preview-box" style={{paddingTop: "1%"}}>
                  <img src={img} alt="preview" width="95%" hieght="95%" />
                </div>
            )}
          </div>
    }

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
      };

  return (
    <section>
    <div class="col-12">
      <div class="title" style={{fontFamily: 'Roboto, sans-serif', fontSize: "2rem", marginTop: "0rem", marginBottom: '3rem', color: "whitesmoke"}}>Create 3D Printable Item </div>
        <div class="row">
          <div class="col-5 offset-2">
            <div id="success_message"></div>
				      <div class="form_element">
					      <div class="col-md-4" style={{marginLeft: "-25px"}}>
					    	  <label class="form-label" style={{fontSize: "1.25rem", color: "whitesmoke"}}>Upload File<span class="text-danger">*</span></label>
					      </div>
                  <div class="upload-box">
                    {/*}
                  <Form.Item >
                    <Form.Item name="dragger" valuePropNamze="fileList" getValueFromEvent={normFile} noStyle>
                      <Upload.Dragger name="files" action="/upload.do">
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                      </Upload.Dragger>
                    </Form.Item>
                  </Form.Item>
  */}
                      <input
                        id="input_image"
                        type="file"
                        name="image" 
                        accept="image/png, image/jpeg"
                        style={{paddingTop: "15%"}} 
                        placeholder="Upload one of the supported file types: .stl, ???"
                        onChange={e => {
                          const imgUrl = URL.createObjectURL(e.target.files[0]);
                          console.log(imgUrl);
                          setImg(imgUrl);
                          }}
                      />
                      <p style={{fontSize: "1rem", color: "whitesmoke"}}>Click or drag a file to this area to upload</p>
                  </div>
                </div>
              <div class="form_element">
                <div class="col-md-1">
					    	  <label class="form-label" style={{fontSize: "1.25rem", marginLeft: "-10px", color: "whitesmoke"}}>Name<span class="text-danger">*</span></label>
					      </div>
                <input class="inp" style={{color: "whitesmoke"}} type=" text" id="input_name" name="name" placeholder="e.g Golum's Nutsack"></input>
              </div>
              <div class="form_element">
					      <div class="col-md-5" style={{marginLeft: "-15px", color: "whitesmoke"}}>
					      	<label class="form-label" style={{fontSize: "1.25rem", scrollBehavior: "auto"}}>Description <span style={{color: "gray"}}>(optional)</span></label>
					      </div>
					      <input class="inp" style={{color: "whitesmoke"}} type=" text" id="input_description" name="description" placeholder="Looks like 2 turkeys shoved in a plastic bag, no wonder frodo liked him so much"/>
				        </div>
                <div class="form_element">
					        <div class="col-md-1">
					    	    <label class="form-label" style={{fontSize: "1.25rem", color: "whitesmoke"}}>Supply<span class="text-danger">*</span></label>
					        </div>
					        <input class="inp" style={{color: "whitesmoke"}} type=" text" id="input_quantity" name="Quantity" placeholder="Enter Quantity of copies to mint"/>
				        </div>
                <div class="form_element">
					        <div class="col-md-3" style={{marginLeft: "-15px", marginBottom: "5px"}}>
					    	    <label class="form-label" style={{fontSize: "1.25rem", color: "whitesmoke"}}>Category <span class="text-danger">*</span></label>
					        </div>
					        <select class="inp" style={{color: "whitesmoke"}} type=" text" id="input_tag" name="Tag" placeholder="Tag">
					    	    <option value="Figurines">Figurines</option>
					    	    <option value="Automotive">Automotive</option>
					    	    <option value="Sports">Sports</option>
					    	    <option value="Other">Other</option>
					        </select>
				        </div>
                <div class="form_element">
					        <div class="col-md-1">
					        	<label class="form-label" style={{fontSize: "1.25rem", color: "whitesmoke"}}>Artist<span class="text-danger">*</span></label>
					        </div>
					        <input class="inp" style={{color: "whitesmoke"}} type=" text" id="input_creator" name="name" placeholder="What Filthy Hobbit Made This?"/>
				        </div>
              </div>
              <div class="col-5 offset-7" style={{position: "fixed", height: "40vh", marginTop: "1rem", marginBottom: "5rem"}}>
			            <div class="title" style={{fontFamily: "Roboto, sans-serif", fontSize: "1.5rem", float: "left", marginLeft: "2rem", marginBottom: "1.5rem", color: "whitesmoke"}}>Item Preview</div>
      		        {preview()}
                  </div>      
                </div>
              </div>
              <div class="row col-12 offset-6" style={{marginTop: "5rem"}}>
                
                <button type="button" class="btn btn-primary btn-lg" htmlType="submit">
                  Submit
                </button>
              </div>
      
    {/*
    <Form
    name="validate_other"
    {...formItemLayout}
    onFinish={onFinish}
    initialValues={{
      'input-number': 1,
    }}
  >

    <Form.Item name={['name']} label="Name" rules={[{ required: true }]}>
        <Input />
    </Form.Item>
    <Form.Item name={['description']} label="Description" rules={[{ required: false }]}>
        <Input />
    </Form.Item>

    <Form.Item label="Mint Supply:" rules={[{ required: true }]}>
      <Form.Item name="supply" noStyle>
        <InputNumber min={1} max={100000} />
      </Form.Item>
      <span className="ant-form-text">Supply</span>
    </Form.Item>

    <Form.Item
      name="Category"
      label="Category"
      rules={[
        {
          required: true,
          message: 'Please select your NFTs Category!',
          type: 'array',
        },
      ]}
    >
      <Select mode="multiple" placeholder="Please Select Your NFTs Category">
        <Option value="Figurines">Figurines</Option>
        <Option value="Automotive">Automotive</Option>
        <Option value="Sports">Sports</Option>
        <Option value="Other">Other</Option>
      </Select>
    </Form.Item>

    <Form.Item name={['creator']} label="Creator" rules={[{ required: true }]}>
        <Input />
    </Form.Item>

    <Form.Item
      wrapperCol={{
        span: 12,
        offset: 6,
      }}
    >
      <Button type="primary" htmlType="submit" >
        Submit
      </Button>
    </Form.Item>
  </Form>
    */}
  </section>
  );
}

export default NFTMint;
