import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from 'reactstrap'
import { updateBuilding } from '../../../apis/buildingApiService'
import { AppContext } from '../../../context/AppProvider'
import { notify } from '../../../components/Toast/ToastCustom'

export const EditBuildingModal = ({ handleReload }) => {
  const { openBuildingModal, setOpenBuildingModal, buildingModal } =
    useContext(AppContext)
  const [buildingName, setBuildingName] = useState('')
  const [longitude, setLongitude] = useState('')
  const [latitude, setLatitude] = useState('')
  const [isLoadingCircle, setIsLoadingCircle] = useState(false)

  useEffect(() => {
    setBuildingName(buildingModal.name || '')
    setLongitude(buildingModal.longitude || '')
    setLatitude(buildingModal.latitude || '')
  }, [buildingModal])

  const handleUpdate = () => {
    setIsLoadingCircle(true)
    let building = {
      name: buildingName,
      longitude: longitude,
      latitude: latitude,
    }
    updateBuilding(building, buildingModal.id)
      .then((res) => {
        if (res.data) {
          notify('Cập nhật tòa nhà thành công', 'Success')
          handleReload()
          setOpenBuildingModal(false)
          setIsLoadingCircle(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setOpenBuildingModal(false)
        setIsLoadingCircle(false)
        notify('Đã xảy ra lỗi gì đó!!', 'Error')
      })
  }

  return (
    <>
      <Row>
        <Col md="4">
          <Modal
            className="modal-dialog-centered"
            size="md"
            isOpen={openBuildingModal}
            toggle={() => setOpenBuildingModal(false)}
          >
            <div className="modal-body p-0">
              <Card className="bg-secondary border-0 mb-0">
                <CardHeader
                  className="bg-transparent"
                  style={{ border: 'none' }}
                >
                  <h3>Chỉnh sửa tòa nhà</h3>
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
                                      Mã tòa nhà
                                    </label>
                                    <input
                                      className="form-control"
                                      type="search"
                                      value={buildingModal.id}
                                      readOnly
                                      onChange={() => {}}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="form-control-label">
                                      Tên tòa nhà
                                    </label>
                                    <input
                                      className="form-control"
                                      type="search"
                                      value={`${buildingName}`}
                                      onChange={(e) =>
                                        setBuildingName(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="form-control-label">
                                      Kinh độ
                                    </label>
                                    <input
                                      className="form-control"
                                      type="search"
                                      value={`${longitude}`}
                                      onChange={(e) =>
                                        setLongitude(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label className="form-control-label">
                                      Vĩ độ
                                    </label>
                                    <input
                                      className="form-control"
                                      type="search"
                                      value={`${latitude}`}
                                      onChange={(e) =>
                                        setLatitude(e.target.value)
                                      }
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
                        onClick={() => setOpenBuildingModal(false)}
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
                        onClick={() => handleUpdate()}
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
                              <span style={{ color: '#fff' }}>Chỉnh Sửa</span>
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
