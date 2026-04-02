import React, { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Modal,
  Row,
  Spinner,
} from 'reactstrap'
import { createBuilding, createBuildingByArea } from '../../../apis/buildingApiService'
import { getListArea, getListBuildingByAreaId } from '../../../apis/storeApiService'
import { getListHub } from '../../../apis/areaApiService'
import { notify } from '../../../components/Toast/ToastCustom'
import { AppContext } from '../../../context/AppProvider'

export const NewBuilding = ({ handleReload }) => {
  const { openNewBuildingModal, setOpenNewBuildingModal } =
    useContext(AppContext)
  const [buildingName, setBuildingName] = useState('')
  const [buildingNameState, setBuildingNameState] = useState('')
  const [longitude, setLongitude] = useState('')
  const [longitudeState, setLongitudeState] = useState('')
  const [latitude, setLatitude] = useState('')
  const [latitudeState, setLatitudeState] = useState('')
  const [status, setStatus] = useState({ label: 'Hoạt động', value: 0 })
  const [isLoadingCircle, setIsLoadingCircle] = useState(false)

  const [areas, setAreas] = useState([])
  const [areaSelected, setAreaSelected] = useState(null)
  const [clusters, setClusters] = useState([])
  const [clusterSelected, setClusterSelected] = useState(null)

  const [hubs, setHubs] = useState([])
  const [hubSelected, setHubSelected] = useState(null)

  useEffect(() => {
    getListArea(1, 100)
      .then((res) => {
        if (res.data) {
          const areaList = res.data
          let opts = areaList.map((item) => ({
            label: item.name,
            value: item.id,
          }))
          setAreas(opts)
          if (opts.length > 0) {
            setAreaSelected(opts[0])
            handleLoadClusters(opts[0].value)
          }
        }
      })
      .catch((error) => console.log(error))

    getListHub(1, 100)
      .then((res) => {
        if (res.data) {
          const hubList = res.data
          let opts = hubList.map((item) => ({
            label: item.name,
            value: item.id,
          }))
          setHubs(opts)
          if (opts.length > 0) {
            setHubSelected(opts[0])
          }
        }
      })
      .catch((error) => console.log(error))
  }, [])

  const handleLoadClusters = (areaId) => {
    setClusters([])
    setClusterSelected(null)
    getListBuildingByAreaId(areaId)
      .then((res) => {
        if (res.data && res.data.listCluster) {
          let opts = res.data.listCluster.map((item) => ({
            label: item.name,
            value: item.id,
          }))
          setClusters(opts)
          if (opts.length > 0) {
            setClusterSelected(opts[0])
          }
        }
      })
      .catch((error) => console.log(error))
  }

  const validateForm = () => {
    let valid = true
    if (buildingName === '') {
      valid = false
      setBuildingNameState('invalid')
    } else {
      setBuildingNameState('valid')
    }
    if (longitude === '') {
      valid = false
      setLongitudeState('invalid')
    } else {
      setLongitudeState('valid')
    }
    if (latitude === '') {
      valid = false
      setLatitudeState('invalid')
    } else {
      setLatitudeState('valid')
    }
    return valid
  }

  const handleCreate = () => {
    if (validateForm()) {
      setIsLoadingCircle(true)
      let building = {
        name: buildingName,
        hubId: hubSelected ? hubSelected.value.toString() : '',
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      }

      if (areaSelected && clusterSelected) {
        createBuildingByArea(
          areaSelected.value.toString(),
          clusterSelected.value.toString(),
          building
        )
          .then((res) => {
            if (res.data) {
              notify('Thêm tòa nhà thành công', 'Success')
              handleReload()
              handleReset()
            }
          })
          .catch((error) => {
            console.log(error)
            setIsLoadingCircle(false)
            notify('Đã xảy ra lỗi gì đó!!', 'Error')
          })
      } else {
        createBuilding(building)
          .then((res) => {
            if (res.data) {
              notify('Thêm tòa nhà thành công', 'Success')
              handleReload()
              handleReset()
            }
          })
          .catch((error) => {
            console.log(error)
            setIsLoadingCircle(false)
            notify('Đã xảy ra lỗi gì đó!!', 'Error')
          })
      }
    }
  }

  const handleReset = () => {
    setOpenNewBuildingModal(false)
    setIsLoadingCircle(false)
    setBuildingName('')
    setBuildingNameState('')
    setLongitude('')
    setLongitudeState('')
    setLatitude('')
    setLatitudeState('')
  }

  const customStylesPayment = {
    control: (provided, state) => ({
      ...provided,
      background: '#fff',
      borderColor: '#dee2e6',
      minHeight: '30px',
      height: '46px',
      boxShadow: state.isFocused ? null : null,
      borderRadius: '0.5rem',
    }),
    input: (provided, state) => ({
      ...provided,
      margin: '5px',
    }),
  }

  const optionsStatus = [
    { label: 'Hoạt động', value: 0 },
    { label: 'Ngưng hoạt động', value: 1 },
  ]

  return (
    <>
      <Row>
        <Col md="4">
          <Modal
            className="modal-dialog-centered"
            size="lg"
            isOpen={openNewBuildingModal}
            toggle={() => handleReset()}
          >
            <div className="modal-body p-0">
              <Card className="bg-secondary border-0 mb-0">
                <CardHeader
                  className="bg-transparent"
                  style={{ border: 'none' }}
                >
                  <h3>Thêm tòa nhà mới</h3>
                </CardHeader>
                <CardBody className="" style={{ paddingTop: 0 }}>
                  <Container className="" fluid style={{ padding: '0 0px' }}>
                    <Row>
                      <div className="col-lg-12 modal-product">
                        <Card>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '100%',
                              padding: '10px 0px',
                            }}
                            className="align-items-center"
                          >
                            <CardHeader
                              className="border-0"
                              style={{ padding: '15px' }}
                            >
                              <h2 className="mb-0">Thông tin tòa nhà</h2>
                            </CardHeader>
                          </div>
                          <div className="col-md-12">
                            <form>
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="form-control-label">
                                      Tên tòa nhà
                                    </label>
                                    <Input
                                      valid={buildingNameState === 'valid'}
                                      invalid={buildingNameState === 'invalid'}
                                      className="form-control"
                                      type="search"
                                      value={buildingName}
                                      onChange={(e) =>
                                        setBuildingName(e.target.value)
                                      }
                                    />
                                    <div className="invalid-feedback">
                                      Tên tòa nhà không được để trống
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="form-control-label">
                                      Khu vực
                                    </label>
                                    <Select
                                      options={areas}
                                      placeholder="Chọn khu vực"
                                      styles={customStylesPayment}
                                      value={areaSelected}
                                      onChange={(e) => {
                                        setAreaSelected(e)
                                        handleLoadClusters(e.value)
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="form-control-label">
                                      Cụm tòa nhà
                                    </label>
                                    <Select
                                      options={clusters}
                                      placeholder="Chọn cụm tòa nhà"
                                      styles={customStylesPayment}
                                      value={clusterSelected}
                                      onChange={(e) => setClusterSelected(e)}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="form-control-label">
                                      Kinh độ
                                    </label>
                                    <Input
                                      valid={longitudeState === 'valid'}
                                      invalid={longitudeState === 'invalid'}
                                      className="form-control"
                                      type="search"
                                      value={longitude}
                                      onChange={(e) =>
                                        setLongitude(e.target.value)
                                      }
                                    />
                                    <div className="invalid-feedback">
                                      Kinh độ không được để trống
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="form-control-label">
                                      Vĩ độ
                                    </label>
                                    <Input
                                      valid={latitudeState === 'valid'}
                                      invalid={latitudeState === 'invalid'}
                                      className="form-control"
                                      type="search"
                                      value={latitude}
                                      onChange={(e) =>
                                        setLatitude(e.target.value)
                                      }
                                    />
                                    <div className="invalid-feedback">
                                      Vĩ độ không được để trống
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="form-control-label">
                                      Hub
                                    </label>
                                    <Select
                                      options={hubs}
                                      placeholder="Chọn Hub"
                                      styles={customStylesPayment}
                                      value={hubSelected}
                                      onChange={(e) => setHubSelected(e)}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="form-control-label">
                                      Trạng Thái
                                    </label>
                                    <Select
                                      options={optionsStatus}
                                      placeholder="Trạng Thái"
                                      styles={customStylesPayment}
                                      value={status}
                                      onChange={(e) => setStatus(e)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </Card>
                      </div>
                    </Row>
                    <Col className="text-md-right mb-3" lg="12" xs="5">
                      <Button
                        onClick={() => handleReset()}
                        color="default"
                        size="lg"
                        style={{
                          background: '#fff',
                          color: '#000',
                          padding: '0.875rem 2rem',
                          border: 'none',
                        }}
                      >
                        <div
                          className="flex"
                          style={{ alignItems: 'center' }}
                        >
                          <i
                            className="fa-solid fa-backward"
                            style={{ fontSize: 18 }}
                          ></i>
                          <span>Đóng</span>
                        </div>
                      </Button>
                      <Button
                        onClick={() => handleCreate()}
                        className="btn-neutral"
                        disabled={isLoadingCircle}
                        color="default"
                        size="lg"
                        style={{
                          background: 'var(--primary)',
                          color: '#000',
                          padding: '0.875rem 2rem',
                        }}
                      >
                        <div
                          className="flex"
                          style={{
                            alignItems: 'center',
                            width: 99,
                            justifyContent: 'center',
                          }}
                        >
                          {isLoadingCircle ? (
                            <Spinner
                              style={{
                                color: '#fff',
                                width: '1.31rem',
                                height: '1.31rem',
                              }}
                            >
                              Loading...
                            </Spinner>
                          ) : (
                            <>
                              <i
                                className="fa-solid fa-square-plus"
                                style={{ fontSize: 18, color: '#fff' }}
                              ></i>
                              <span style={{ color: '#fff' }}>Thêm mới</span>
                            </>
                          )}
                        </div>
                      </Button>
                    </Col>
                  </Container>
                </CardBody>
              </Card>
            </div>
          </Modal>
        </Col>
      </Row>
    </>
  )
}
