import { useEffect, useState } from "react";
import { Card } from "./card/Card";
import { orderService } from "../../services/orderService";
import { CategoriesChart } from "./categories/chart/CategoriesChart";
import styles from './AdminDashboard.module.scss';
import { AddCategory } from "./categories/form/AddCategory";
import { AddProduct } from "./products/form/AddProduct";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { CategoriesModel } from "../../models/productsModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faTrashRestoreAlt } from "@fortawesome/free-solid-svg-icons";
import { getCategories } from "../../store/actions/categories-actions";
import { CustomModal } from "../../shared/modal/Modal";
import DatePicker from 'react-datepicker';
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { CategoriesStatsModel } from "../../models/orderModel";
import { IncomeChart } from "./categories/chart/IncomeChart";

interface GraphData {
  value: number;
  name: string;
}

const colors = ['#01a5e4', '#8dd7c0', '#ff96c6', '#C05780', '#0165A3', '#F2D4CC', '#FB6238', '#0165a3'];

const AdminDashboard = () => {
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const categories = useSelector<RootState, CategoriesModel[]>((state) => state.categories);
  const dispatch = useDispatch<AppDispatch>();
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState<boolean>(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [date, setDate] = useState<any>();
  const [month, setMonth] = useState<any>();
  const { control } = useForm();
  const [categoryStats, setCategoryStats] = useState<CategoriesStatsModel[]>();
  const [incomeData, setIncomeData] = useState<GraphData[]>([]);
  const [average, setAverage] = useState<number>();
  const [ordersCount, setOrdersCount] = useState<number>();
  const [totalIncome, setTotalIncome] = useState<number>();
  const [isMonth, setIsMonth] = useState<boolean>(true);

  useEffect(() => {
    dispatch(getCategories());
    orderService.getSummary({ date: date, month: month })
      .then((res) => {
        const result = res[0];
        if (result) {
          const categories = result.categories;
          setCategoryStats(categories);
          const data = result.categories.map(({ category, count }) => ({ value: count, name: category }));
          setGraphData(data);
          const incomeData = result.categories.map(({ category, total }) => ({ value: total, name: category }));
          setIncomeData(incomeData);
          setOrdersCount(result.count);
          setAverage(result.average);
          setTotalIncome(result.total);
        } else {
          setCategoryStats([]);
          setGraphData([]);
          setIncomeData([]);
        }
      });
  }, [date, month]);


  const onDateChange = (value: Date) => {
    setDate(new Date(value));
    setMonth('');
  };

  const onMonthChange = (value: Date) => {
    setMonth(new Date(value));
    setDate('');
  };

  const deleteCategory = (id: number) => {
    orderService.deleteCategory(id)
      .then(() => dispatch(getCategories()));
  };

  const onSelectChange = (value: string) => {
    if (value === 'month') {
      setIsMonth(false);
    } else {
      setIsMonth(true);
    }
  };

  const onHideAdd = () => {
    setIsAddProductModalOpen(false);
  };

  const onHideCat = () => {
    setIsAddCategoryModalOpen(false)
  }

  const options = [
    { value: 'month', label: 'month' },
    { value: 'day', label: 'day' }
  ];

  return <div className={styles.wrapper}>
    <div className={styles.header}>
      <Card>
        <div className={styles.title}>
          <div className={styles.addBtns}>
            <button onClick={() => setIsAddCategoryModalOpen(true)}>Add new category</button>
            <button onClick={() => setIsAddProductModalOpen(true)}>Add new product</button>
          </div>
          <div className={styles.actions}>
            <Form.Group className={styles.picker}>
              <Select placeholder='select by day or month' options={options} onChange={(data) => onSelectChange(data?.value!)}></Select>
            </Form.Group>
            {isMonth && <Form.Group>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    placeholderText="day"
                    className='form-control'
                    selected={date}
                    onChange={(value) => {
                      onChange(value);
                      onDateChange(value!);
                    }}
                    dateFormat='yyyy-MM-dd'
                    autoComplete='off'
                  />
                )}
                control={control}
                name='day'
              />
            </Form.Group>}
            {!isMonth && <Form.Group className={styles.picker}>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    placeholderText="month"
                    className='form-control'
                    selected={month}
                    onChange={(value) => {
                      onChange(value);
                      onMonthChange(value!);
                    }}
                    dateFormat='yyyy-MM'
                    autoComplete='off'
                    showMonthYearPicker
                  />
                )}
                control={control}
                name='day'
              />
            </Form.Group>}
          </div>
        </div>
      </Card>
    </div>

    <div className={styles.list}>
      <Card>
        <div>
          <h5>Categories</h5>
        </div>
        <ul className={styles.categoriesList}>
          {categories && categories.map((category, index) => {
            console.log(category.name)
            return (<li key={index}>
              <p>{category.name}</p>
              <button key={category._id} onClick={() => deleteCategory(category._id)}>
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </li>);
          }
          )}
        </ul>
      </Card>
    </div>

    <div className={styles.income}>
      <Card>
        <div>
          <h5>Total income per category</h5>
        </div>
        <div>
          <div className={styles.incomeInfo}>

          </div>
          <IncomeChart
            data={incomeData}
            colors={colors}
          />
        </div>
      </Card>
    </div>
    <div className={styles.stats}>
      <Card>
        <div>
          <h5>Averages</h5>
        </div>
        <div className={styles.statsInfo}>
          <div>
            <h6>Total orders count: <span>{ordersCount}</span></h6>
          </div>
          <div>
            <h6>Total orders income: <span>{totalIncome} $</span></h6>
          </div>
          <div>
            <h6>Average order price: <span>{average?.toFixed(2)} $</span></h6>
          </div>

        </div>
      </Card>
    </div>
    <div className={styles.categoryCount}>
      <Card>
        <div className={styles.chartWrapper}>
          <div>
            <h5>Orders count per category</h5>
          </div>
          <CategoriesChart
            colors={colors}
            data={graphData}
          />
        </div>
      </Card>
    </div>

    <CustomModal
      show={isAddCategoryModalOpen}
      onHide={() => setIsAddCategoryModalOpen(false)}>
      <AddCategory hide={onHideCat} />
    </CustomModal>
    <CustomModal
      show={isAddProductModalOpen}
      onHide={() => setIsAddProductModalOpen(false)}>
      <AddProduct hide={onHideAdd} />
    </CustomModal>
  </div>;
};

export default AdminDashboard;