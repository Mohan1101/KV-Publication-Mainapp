import React, { Component } from 'react';
import firebaseApp from '../Firebasse';
import { Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SubIncomeTable from './SubIncomeTable';

class IncomeTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      incomeCategories: [],
      expenseCategories: [],
      newIncomeCategoryName: '',
      newExpenseCategoryName: '',
      selectedCategory: null,
    };
  }

  handleAddCategory = async (documentType) => {
    const { newIncomeCategoryName, newExpenseCategoryName } = this.state;
    const newCategoryName = documentType === 'INCOME' ? newIncomeCategoryName : newExpenseCategoryName;

    if (newCategoryName.trim() !== '') {
      try {
        await firebaseApp.firestore().collection('CATEGORY').doc(documentType).collection(documentType).doc(newCategoryName).set({});
        this.getCategories();
        this.setState({ newIncomeCategoryName: '', newExpenseCategoryName: '' });
        console.log(`Category "${newCategoryName}" added to "${documentType}" document.`);
      } catch (error) {
        console.error(`Error adding category to "${documentType}" document:`, error);
      }
    }
  };

  handleDeleteCategory = async (category, documentType) => {
    try {
      await firebaseApp.firestore().collection('CATEGORY').doc(documentType).collection(documentType).doc(category).delete();
      this.getCategories();
      console.log(`Category "${category}" deleted from "${documentType}" document.`);
    } catch (error) {
      console.error(`Error deleting category from "${documentType}" document:`, error);
    }
  };

  getCategories = async () => {
    try {
      const incomeCategoriesSnapshot = await firebaseApp.firestore().collection('CATEGORY').doc('INCOME').collection('INCOME').get();
      const incomeCategories = incomeCategoriesSnapshot.docs.map((doc) => doc.id);

      const expenseCategoriesSnapshot = await firebaseApp.firestore().collection('CATEGORY').doc('EXPENSE').collection('EXPENSE').get();
      const expenseCategories = expenseCategoriesSnapshot.docs.map((doc) => doc.id);

      this.setState({
        incomeCategories,
        expenseCategories,
      });
    } catch (error) {
      console.error('Error getting categories:', error);
    }
  };

  handleCategorySelect = (selectedCategory, categoryType) => {
    this.setState({
      selectedCategory,
    });

    if (this.subIncomeTableRef) {
      this.subIncomeTableRef.updateSubIncomeData(selectedCategory, categoryType);
    }
  };

  componentDidMount() {
    this.getCategories();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedCategory !== prevState.selectedCategory) {
      this.subIncomeTableRef && this.subIncomeTableRef.updateSubIncomeData(this.state.selectedCategory);
    }
  }

  render() {
    return (
      <div>
        <table className="styled-table">
          <thead>
            <tr >
              <th>Income</th>
              <th>Expense</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{cursor: 'pointer'}} >
              <td>
                <table className="styled-table">
                  <tbody>
                    {this.state.incomeCategories.map((category) => (
                      <tr key={category}>
                        <td onClick={() => this.handleCategorySelect(category, 'INCOME')}>{category}</td>
                        <td>
                          <DeleteIcon
                            className='deleteIcon'
                            onClick={() => this.handleDeleteCategory(category, 'INCOME')}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <TextField
                  label="Category Name"
                  variant="outlined"
                  value={this.state.newIncomeCategoryName}
                  onChange={(e) => this.setState({ newIncomeCategoryName: e.target.value })}
                  style={{ marginTop: '2%' }}
                />
                <Button
                  variant="contained"
                  onClick={() => this.handleAddCategory('INCOME')}
                  style={{ marginLeft: '2%', marginTop: '4%' }}
                >
                  Add Category
                </Button>
              </td>
              <td>
                <table className="styled-table">
                  <tbody>
                    {this.state.expenseCategories.map((category) => (
                      <tr key={category}>
                        <td onClick={() => this.handleCategorySelect(category, 'EXPENSE')}>{category}</td>
                        <td>
                          <DeleteIcon
                            className='deleteIcon'
                            onClick={() => this.handleDeleteCategory(category, 'EXPENSE')}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <TextField
                  label="Category Name"
                  variant="outlined"
                  value={this.state.newExpenseCategoryName}
                  onChange={(e) => this.setState({ newExpenseCategoryName: e.target.value })}
                  style={{ marginTop: '2%' }}
                />
                <Button
                  variant="contained"
                  onClick={() => this.handleAddCategory('EXPENSE')}
                  style={{ marginLeft: '2%', marginTop: '4%' }}
                >
                  Add Category
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
        {this.state.selectedCategory && (
          <SubIncomeTable
            ref={(ref) => (this.subIncomeTableRef = ref)}
            selectedCategory={this.state.selectedCategory}
            type="INCOME"
          />
        )}
      </div>
    );
  }
}

export default IncomeTable;
