/*

=========================================================
* Argon Dashboard PRO React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// reactstrap components
import { useContext, useEffect, useState } from 'react'
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
  Table,
} from 'reactstrap'
import { getListBuildings, deleteBuildingById } from '../../../apis/buildingApiService'
import SimpleHeader from '../../../components/Headers/SimpleHeader'
import { notify } from '../../../components/Toast/ToastCustom'
import { AppContext } from '../../../context/AppProvider'
import { BuildingItem } from './BuildingItem'
import { NewBuilding } from './NewBuilding'
import { EditBuildingModal } from './EditBuildingModal'
import Lottie from 'react-lottie'
import animationData from '../../../assets/loading.json'

// core components
function BuildingManage() {
  const {
    storeCategoryModal,
    setOpenDeleteModal,
    openDeleteModal,
    setOpenNewBuildingModal,
  } = useContext(AppContext)

  const [buildings, setBuildings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingCircle, setIsLoadingCircle] = useState(false)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  const handleGetBuildings = () => {
    setIsLoading(true)
    setBuildings([])
    getListBuildings(1, 100)
      .then((res) => {
        if (res.data) {
          setBuildings(res.data)
          setIsLoading(false)
        } else {
          setBuildings([])
          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setIsLoading(false)
        setBuildings([])
        notify('Đã xảy ra lỗi gì đó!!', 'Error')
      })
  }

  useEffect(() => {
    handleGetBuildings()
  }, [])

  const handleReload = () => {
    handleGetBuildings()
  }

  const handleDeleteBuilding = (id) => {
    setIsLoadingCircle(true)
    deleteBuildingById(id)
      .then((res) => {
        if (res.data) {
          setIsLoading(false)
          notify('Xóa tòa nhà thành công', 'Success')
          handleGetBuildings()
          setOpenDeleteModal(false)
          setIsLoadingCircle(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setIsLoadingCircle(false)
        setIsLoading(false)
        notify('Đã xảy ra lỗi gì đó!!', 'Error')
      })
  }

  return (
    <>
      <EditBuildingModal handleReload={handleReload} />
      <NewBuilding handleReload={handleReload} />
      <SimpleHeader
        name="Danh Sách Tòa Nhà"
        parentName="Quản Lý"
      />
      <Modal
        className="modal-dialog-centered"
        size="sm"
        isOpen={openDeleteModal}
        toggle={() => {
          setOpenDeleteModal(false)
        }}
      >
        <div className="modal-body p-0">
          <Card className="bg-secondary border-0 mb-0">
            <div className="" style={{ paddingTop: 0 }}>
              <Container
                className=""
                fluid
                style={{ padding: '1.5rem 1.5rem 1rem 1.5rem ' }}
              >
                <Row>
                  <div className="col-lg-12 ">
                    <h3>Bạn có chắc</h3>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        padding: '0px 0px 30px 0px',
                      }}
                      className=""
                    >
                      <span className="mb-0">
                        Tòa nhà:{' '}
                        <span style={{ fontWeight: 700 }}>
                          {storeCategoryModal.name}
                        </span>{' '}
                        sẽ bị xóa!!!{' '}
                      </span>
                      <span className="mb-0">
                        Bạn sẽ không thể hoàn nguyên hành động này{' '}
                      </span>
                    </div>
                    <div className="col-md-12"></div>
                  </div>
                </Row>
                <Col className="text-md-right mb-3" lg="12" xs="5">
                  <Row style={{ justifyContent: 'flex-end' }}>
                    {' '}
                    <Button
                      onClick={() => {
                        setOpenDeleteModal(false)
                      }}
                      color="default"
                      size="lg"
                      style={{
                        background: '#fff',
                        color: '#000',
                        padding: '0.875rem 1rem',
                        border: 'none',
                      }}
                    >
                      <div
                        className="flex"
                        style={{
                          alignItems: 'center',
                          width: 80,
                          justifyContent: 'center',
                        }}
                      >
                        <span>Đóng</span>
                      </div>
                    </Button>
                    <Button
                      onClick={() => {
                        setIsLoadingCircle(true)
                        handleDeleteBuilding(storeCategoryModal.id)
                      }}
                      className="btn-neutral"
                      disabled={isLoadingCircle}
                      color="default"
                      size="lg"
                      style={{
                        background: 'var(--primary)',
                        color: '#fff',
                        padding: '0.875rem 1rem',
                      }}
                    >
                      <div
                        className="flex"
                        style={{
                          alignItems: 'center',
                          width: 80,
                          justifyContent: 'center',
                        }}
                      >
                        {isLoadingCircle ? (
                          <Spinner
                            style={{
                              color: 'rgb(100,100,100)',
                              width: '1.31rem',
                              height: '1.31rem',
                            }}
                          >
                            Loading...
                          </Spinner>
                        ) : (
                          <>
                            <span>Chắc chắn</span>
                          </>
                        )}
                      </div>
                    </Button>
                  </Row>
                </Col>
              </Container>
            </div>
          </Card>
        </div>
      </Modal>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '20px 0px',
                }}
                className="align-items-center"
              >
                <CardHeader
                  className="flex"
                  style={{ padding: '0 0 0 20px', borderBottom: 'none' }}
                >
                  <h3 className="mb-0">Quản lý tòa nhà</h3>
                </CardHeader>

                <Col className="mt-3 mt-md-0 text-md-right" lg="3" xs="3">
                  <Button
                    onClick={() => {
                      setOpenNewBuildingModal(true)
                    }}
                    className="btn-neutral"
                    color="default"
                    size="lg"
                    style={{
                      background: 'var(--primary)',
                      color: '#fff',
                      fontWeight: 700,
                      border: '1px solid var(--primary)',
                    }}
                  >
                    + Thêm Tòa Nhà Mới
                  </Button>
                </Col>
              </div>
              {!isLoading && (
                <Table
                  className="align-items-center table-flush"
                  responsive
                  hover={true}
                >
                  <thead className="thead-light">
                    <tr>
                      <th className="sort table-title" scope="col">
                        STT
                      </th>
                      <th className="sort table-title" scope="col">
                        Mã tòa nhà
                      </th>
                      <th className="sort table-title" scope="col">
                        Tên tòa nhà
                      </th>
                      <th className="sort table-title" scope="col">
                        Kinh độ
                      </th>
                      <th className="sort table-title" scope="col">
                        Vĩ độ
                      </th>
                      <th className="sort table-title" scope="col">
                        Trạng thái
                      </th>
                      <th className="sort table-title" scope="col">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="list" style={{ position: 'relative' }}>
                    <div
                      className={`loading-spin ${
                        !isLoading && 'loading-spin-done'
                      }`}
                    ></div>
                    {buildings.length > 0 &&
                      buildings.map((item, index) => {
                        return (
                          <BuildingItem
                            data={item}
                            key={index}
                            index={index}
                          />
                        )
                      })}
                  </tbody>
                </Table>
              )}

              {buildings.length === 0 && !isLoading && (
                <>
                  <div
                    className="center_flex"
                    style={{ padding: '50px 0 0 0' }}
                  >
                    <img
                      src="/icons/empty.png"
                      alt=""
                      style={{ textAlign: 'center', width: 300 }}
                    />
                  </div>
                  <h1
                    className="description"
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      padding: '20px 0 50px 0',
                    }}
                  >
                    Không có tòa nhà nào!!!
                  </h1>
                </>
              )}
              {isLoading && (
                <CardBody className=" center_flex">
                  <Lottie options={defaultOptions} height={400} width={400} />
                </CardBody>
              )}
            </Card>
          </div>
        </Row>
      </Container>
    </>
  )
}

export default BuildingManage
