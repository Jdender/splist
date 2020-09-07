import { render } from 'react-dom';
import React, { FC } from 'react';

const Index: FC = () => <h1>Hello world!</h1>;

render(<Index />, document.getElementById('app'));
