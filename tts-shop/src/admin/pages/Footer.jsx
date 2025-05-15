import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Footer = () => {
  const [footerItems, setFooterItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [editedItems, setEditedItems] = useState([]);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/footers');
        setFooterItems(res.data);
      } catch (err) {
        console.error('Lỗi khi tải footer:', err);
      }
    };
    fetchFooter();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    // Sao chép dữ liệu để chỉnh sửa
    setEditedItems(footerItems.map(item => ({ ...item })));
  };

  const handleSave = () => {
  console.log('Dữ liệu gửi đi:', editedItems); // Check if data is correct

  Promise.all(editedItems.map(item =>
    axios.put(`http://localhost:5000/api/footers/${item.id_footer}`, item)
  ))
    .then(() => {
      setFooterItems(editedItems); // Update data after save
      setIsEditing(false); // Turn off editing mode
    })
    .catch(err => {
      console.error('Lỗi khi lưu footer:', err); // Log error to identify issue
      alert('Lỗi khi lưu footer');
    });
};



  const handleCancel = () => {
    setIsEditing(false); // Hủy chế độ chỉnh sửa
    setEditedItems([]); // Reset dữ liệu chỉnh sửa
  };

  const handleChange = (index, field, value) => {
    const updatedItems = [...editedItems];
    updatedItems[index][field] = value;
    setEditedItems(updatedItems);
  };

  return (
    <div className=" mt-4">
      <h3 className="mb-4">Quản lý Footer</h3>
      <Table striped bordered hover responsive className="table-dark mt-9">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tiêu đề</th>
            <th>Nội dung</th>
          </tr>
        </thead>
        <tbody>
          {footerItems.map((item, index) => (
            <tr key={item.id_footer}>
              <td>{index + 1}</td>
              <td>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    value={editedItems[index].title}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                  />
                ) : (
                  item.title
                )}
              </td>
              <td>
                {isEditing ? (
                  <div className="ckeditor-container text-dark">
                    <CKEditor
                      editor={ClassicEditor}
                      data={editedItems[index].content}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        handleChange(index, 'content', data);
                      }}
                    />
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                )}
              </td>
            </tr>
          ))}
          {footerItems.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="mt-4">
        {!isEditing ? (
          <Button variant="warning" onClick={handleEdit}>Sửa</Button>
        ) : (
          <>
            <Button variant="success" onClick={handleSave} className="me-2">Lưu</Button>
            <Button variant="secondary" onClick={handleCancel}>Hủy</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Footer;
