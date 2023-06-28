# Hooks

## useState

> 定义变量，使其具备类组件的 state，让函数式组件拥有更新视图的能力。

### 1.更新基础类型

```tsx
import { useState } from 'react';
import { Button } from 'antd';

const Index: React.FC<any> = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <div>数字：{count}</div>
      <Button type="primary" onClick={() => setCount(count + 1)}>
        第一种方式+1
      </Button>
      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        onClick={() => setCount((v) => v + 1)}
      >
        第二种方式+1
      </Button>
    </>
  );
};

export default Index;
```

### 2.更新引用类型

```tsx
import { useState } from 'react';
import { Button } from 'antd';

const Index: React.FC<unknown> = () => {
  const [person, setPerson] = useState<{
    name: string;
    age: number;
    location: string;
  }>({
    name: '默认值',
    age: 0,
    location: '默认值',
  });

  return (
    <>
      <div>当前person: {JSON.stringify(person)}</div>
      <Button
        type="primary"
        onClick={() =>
          setPerson({
            ...person,
            age: 1,
          })
        }
      >
        更新age
      </Button>
      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        onClick={() =>
          setPerson({
            name: '张三',
            age: 18,
            location: '成都市',
          })
        }
      >
        更新全部
      </Button>
    </>
  );
};

export default Index;
```

## useEffect

> 副作用，成功弥补了函数式组件没有生命周期的缺陷，是最常用的钩子之一

### deps 书写的几种情况

1. deps 如果不写，那么在组件 state/props 发生变化的时候，都会执行 effect,如果 effect 本身还要更新 state，那么就会发生无限循环(不可取)
2. deps 如果是[], 只会在组件挂载的时候执行一次 effect，后面不再执行
3. deps 如果是[a,b], a,b 只要一个发生变化，effect 才会执行

例子:

```tsx
import { useState, useEffect } from 'react';
import { Button } from 'antd';

const Index: React.FC<any> = () => {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    console.log('依赖项什么都不写');
  });
  useEffect(() => {
    console.log('依赖项是空数组');
  }, []);
  useEffect(() => {
    console.log('依赖项是count && flag');
  }, [count, flag]);

  return (
    <>
      <Button type="primary" onClick={() => setCount((v) => v + 1)}>
        count加一：{count}
      </Button>
      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        onClick={() => setFlag((v) => !v)}
      >
        状态切换：{JSON.stringify(flag)}
      </Button>
    </>
  );
};

export default Index;
```

### deps 数据类型

```tsx
import { useState, useEffect } from 'react';
import { Button } from 'antd';

const Index: React.FC<any> = () => {
  const [count, setCount] = useState(0);
  const [person, setPerson] = useState<{
    name: string;
    age: number;
    location: string;
  }>({
    name: '默认值',
    age: 0,
    location: '默认值',
  });

  useEffect(() => {
    console.log('基本数据类型改变');
  }, [count]);
  useEffect(() => {
    console.log('对象数据类型改变');
  }, [person]);

  return (
    <>
      <div>
        <span>count:{count}</span>
        <Button type="primary" onClick={() => setCount((v) => v + 1)}>
          基本数据类型改变：{count}
        </Button>
      </div>
      <div>
        <span>person:{JSON.stringify(person)}</span>
        <Button
          type="primary"
          style={{ marginLeft: 10 }}
          onClick={() =>
            setPerson({
              name: '默认值',
              age: 0,
              location: '默认值',
            })
          }
        >
          对象类型改变
        </Button>
      </div>
    </>
  );
};

export default Index;
```

可以看见,虽然我们更新后的 person 和默认的 person 在值类型上是一样的，但是 useEffect 在比较[person]时，始终认为它已经发生变化了，导致触发 effect。
**这是因为它们的引用地址不同**

> 注意: 如果强行比较对象、数组时，可以通过 JSON.stringify() 转化为字符串，当作 deps 的参数。

useMemo 和 useCallback 中的 deps 也是同理。

## useMemo

> 用于缓存计算结果，只有当依赖项发生变化时，才重新计算缓存的值，从而避免不必要的计算

### 如何使用

```tsx
import { useState, useMemo } from 'react';
import { Button, Input } from 'antd';

const Index: React.FC<any> = () => {
  const [num, setNum] = useState(5);
  const [flag, setFlag] = useState(false);
  return (
    <div>
      <Input
        type="number"
        value={num}
        onChange={(e) => setNum(parseInt(e.target.value))}
      />
      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        onClick={() => setFlag((v) => !v)}
      >
        改变flag
      </Button>
      <Factorial num={num} />
    </div>
  );
};
const Factorial: React.FC<{ num: number }> = ({ num }: props) => {
  const factorial = useMemo(() => {
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    console.log('阶乘重新计算');
    return result;
  }, [num]);

  return (
    <div>
      阶乘：{num}! = {factorial}
    </div>
  );
};
export default Index;
```

可以看出，如果没有使用 useMemo 时，每次点击按钮时，始终都会执行 factorial()方法去计算阶乘，加上后只有在 num 变化时，才会重新计算.

> 注意：useMemo 绝不是用的越多越好，缓存这项技术本身也需要成本。

## useCallBack

> 缓存回调函数，只有当依赖项发生变化时，才重新创建回调函数，从而避免不必要的函数创建和调用

它和 useMemo 几乎是相同的代码实现，useMemo 比 useCallback 多了一步，即执行 nextCreate() 的步骤。useCallback(fn, deps) 等价于 useMemo(() => fn, deps)

### 性能问题

首先 useCallback 可以记住函数，避免函数的重复生成，缓存后的函数传递给子组件时，可以避免子组件的重复渲染，从而提升性能。

那是不是说只要是函数，都加入 useCallback，性能都会得到提升呢？

实际不然，性能的提升还有一个前提：**其子组件必须通过 React.memo 包裹，或者必须使用 shouldComponentUpdate 处理**。
例子：

```tsx
import { useState, useMemo, useCallback, memo } from 'react';
import { Button, Input } from 'antd';

const Index: React.FC<any> = () => {
  const [num, setNum] = useState(0);
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  const add = () => {
    setNum((v) => v + 1);
  };
  const useCallBackAdd = useCallback(() => {
    setCount((v) => v + 1);
  }, [count]);
  return (
    <div>
      <div>数字number：{num}</div>
      <div>数字count：{count}</div>
      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        onClick={() => setFlag((v) => !v)}
      >
        切换{JSON.stringify(flag)}
      </Button>
      <TestButton onAdd={add} num={num}>
        普通点击
      </TestButton>
      <TestButton onAdd={useCallBackAdd}>useCallback点击</TestButton>
    </div>
  );
};
const TestButton: React.FC<{ num: number; onAdd: () => void }> = memo(
  ({ num, onAdd, children }: props) => {
    console.log(children);
    return (
      <div>
        <Button type="primary" style={{ marginLeft: 10 }} onClick={onAdd}>
          {children}
        </Button>
      </div>
    );
  },
);
export default Index;
```

例子中，虽然【useCallback 点击】按钮的 onAdd 方法被 useCallback 包裹，但是在切换 flag 这个无关的 state 时，还是会触发 TestButton 的更新.

用 memo 包裹后，组件传递的 onAdd 还是之前缓存的，没有发生改变，所以不会触发更新。

> 注意: 对于 useCallback，我的建议是：绝大部分场景不使用

## useRef

> 用于创建一个可变的引用，可以在组件渲染之间存储和访问数据;获取 DOM 元素

### 获取 dom 元素

```tsx
import { useRef, FC, forwardRef, useEffect, useImperativeHandle } from 'react';
import { Button, Input } from 'antd';

const Index: React.FC<any> = () => {
  const childRef = useRef(null);
  useEffect(() => {
    console.log('父组件获取子组件的ref', childRef);
  }, []);

  return (
    <div>
      <span>父组件</span>
      <Button onClick={() => childRef.current.handleDo()}>
        调用子组件handleDo
      </Button>
      <Child ref={childRef} />
    </div>
  );
};
const Child: FC<unknown> = forwardRef<HTMLDivElement>((props, ref) => {
  const handleDo = () => {
    console.log('handleDo');
  };
  useImperativeHandle(ref, () => ({
    handleDo,
  }));
  return (
    <div ref={ref}>
      <p>子组件</p>
    </div>
  );
});
export default Index;
```

**想要获取函数式组件的方法，必须使用 useImperativeHandle，原因是函数式组件并没有实例**
