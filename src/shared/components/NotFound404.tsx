import { Button, Result } from 'antd';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

function NotFound404(): ReactElement {
  return (
    <div className="page-404-not-found">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary">
            <Link to="/">Back to Home</Link>
          </Button>
        }
      />
    </div>
    
  );
}

export default NotFound404;
