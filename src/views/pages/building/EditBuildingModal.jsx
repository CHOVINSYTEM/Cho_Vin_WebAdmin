import React, { useContext, useEffect, useState } from 'react'
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
  const [googleMapsLink, setGoogleMapsLink] = useState('')
  const [googleMapsLinkState, setGoogleMapsLinkState] = useState('')

  useEffect(() => {
    setBuildingName(buildingModal.name || '')
    setLongitude(buildingModal.longitude || '')
    setLatitude(buildingModal.latitude || '')
  }, [buildingModal])

  const parseGoogleMapsLink = (link) => {
    // ưu tiên lấy tọa độ địa điểm chính xác từ !3d<lat>!4d<lng>
    const placeRegex = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/
    const placeMatch = link.match(placeRegex)

    // Fallback: lấy từ /@lat,lng (tọa độ viewport)
    const viewRegex = \/@(-?\d+\.\d+),(-?\d+\.\d+)/
    const viewMatch = link.match(viewRegex)

    const rawLat = placeMatch ? placeMatch[1] : viewMatch ? viewMatch[1] : null
    const rawLng = placeMatch ? placeMatch[2] : viewMatch ? viewMatch[2] : null

    if (rawLat !== null && rawLng !== null) {
      const lat = parseFloat(rawLat)
      const lng = parseFloat(rawLng)
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setLatitude(rawLat)
        setLongitude(rawLng)
        setGoogleMapsLinkState('valid')
      } else {
        setGoogleMapsLinkState('invalid')
      }
    } else {
      setGoogleMapsLinkState('invalid')
    }
  }

  const handleGoogleMapsLinkChange = (value) => {
    setGoogleMapsLink(value)
    if (value.trim()) {
      parseGoogleMapsLink(value.trim())
    } else {
      setGoogleMapsLinkState('')
    }
  }

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
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label className="form-control-label d-flex align-items-center" style={{ gap: 6 }}>
                                      <i className="fa-solid fa-location-dot" style={{ color: '#e74c3c' }}></i>
                                      Link Google Maps
                                      <span style={{ fontSize: 11, fontWeight: 400, color: '#888', marginLeft: 4 }}>
                                        (Dán link đầy đủ sau khi mở từ trình duyệt)
                                      </span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                      <Input
                                        valid={googleMapsLinkState === 'valid'}
                                        invalid={googleMapsLinkState === 'invalid'}
                                        className="form-control"
                                        type="text"
                                        placeholder="https://www.google.com/maps/place/.../@lat,lng,..."
                                        value={googleMapsLink}
                                        onChange={(e) => handleGoogleMapsLinkChange(e.target.value)}
                                        style={{ paddingRight: 48 }}
                                      />
                                      {googleMapsLink && (
                                        <button
                                          type="button"
                                          onClick={() => { setGoogleMapsLink(''); setGoogleMapsLinkState('') }}
                                          style={{
                                            position: 'absolute', right: 10, top: '50%',
                                            transform: 'translateY(-50%)', background: 'none',
                                            border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 16,
                                          }}
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                    <div className="invalid-feedback">
                                      Không tìm thấy tọa độ trong link. Hãy dán link Google Maps đầy đủ (dạng /place/.../@lat,lng,...)
                                    </div>
                                    {googleMapsLinkState === 'valid' && (
                                      <small style={{ color: '#2dce89', marginTop: 4, display: 'block' }}>
                                        ✓ Đã tự động điền kinh độ & vĩ độ!
                                      </small>
                                    )}
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
