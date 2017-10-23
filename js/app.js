window.ee = new EventEmitter();

class Article extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible: false};
        this.counter = {counter: 0};
    };
    readmoreClick = (e) => {
        e.preventDefault();
        this.setState({visible: true});
    };

    countClick = (e) => {
        e.preventDefault();
        this.setState({counter: ++this.state.counter});
    };


    render() {
        let author = this.props.data.author,//why not xxx??
            text = this.props.data.text,
            bigText = this.props.data.bigText,
            visible = this.state.visible;
        return (
            <div className="article">
                <p className="news__author">{author}</p>
                <p className={visible ? 'none' : 'news__text'}>{text}</p>
                <a href="#" onClick={this.readmoreClick}
                   className={visible ? 'none' : 'news__readmore'}>Подробнее</a>
                <p className={visible ? "news__big-text" : 'none'} >{bigText}</p>
            </div>
        );
    }
}

class Add extends React.Component{
    constructor(props) {
        super(props);
        this.state = {agreeNotChecked: true};
        this.state = {authorIsEmpty: true};
        this.state = {textIsEmpty: true};
    };

    componentDidMountain = () => {
        ReactDOM.findDOMNode(this.refs.author).focus();
    };

    btnClick =(e) => {
        e.preventDefault();
        const textEl = ReactDOM.findDOMNode(this.refs.text);
        const author = ReactDOM.findDOMNode(this.refs.author).value;
        const text = textEl.value;

        const item = [{
            author: author,
            text: text,
            bigText: ''
        }];

        window.ee.emit('News.add', item);
        textEl.value = '';
        this.setState({textIsEmpty: true});
    };

    onCheckRuleClick = (e) => {
        this.setState({agreeNotChecked: !this.state.agreeNotChecked});
    };

    onAuthorChange = (e) => {
        if (e.target.value.trim().length > 0) {
            this.setState({authorIsEmpty: false})
        } else {
            this.setState({authorIsEmpty: true})
        }
    };
    onTextChange = (e) => {
        if (e.target.value.trim().length > 0) {
            this.setState({textIsEmpty: false})
        } else {
            this.setState({textIsEmpty: true})
        }
    };

//          onFieldChange = (fieldName, e) => {
//              if (e.target.value.trim().length > 0) {
//                  this.setState({[''+fieldName]:false})
//              } else {
//                  this.setState({[''+fieldName]:true})
//              }
//          };



    render() {
        let agreeNotChecked = this.state.agreeNotChecked,
            authorIsEmpty = this.state.authorIsEmpty,
            textIsEmpty = this.state.textIsEmpty;
        return (
            <form className='add cf'>
                <input
                    type='text'
                    className='add__author'
                    onChange={this.onAuthorChange}
                    placeholder='Ваше имя'
                    ref='author'
                />
                <textarea
                    className='add__text'
                    onChange={this.onTextChange}
                    placeholder='Текст новости'
                    ref='text'
                ></textarea>
                <input type='checkbox' ref='checkrule' onChange={this.onCheckRuleClick}/>Я согласен с правилами
                <button
                    className='add__btn'
                    onClick={this.btnClick}
                    ref='alert_button'
                    disabled={!agreeNotChecked || authorIsEmpty || textIsEmpty}
                >
                    Показать alert
                </button>
            </form>

        );
    }
}

class News extends React.Component {
    render() {
        let xxx = this.props.data, newsTemplate;

        if (xxx.length > 0) {
            newsTemplate = xxx.map(function(item, index) {
                return (
                    <div key={index}>
                        <Article data={item}/>
                    </div>
                );
            });
        } else {
            newsTemplate = <p>News is empty</p>
        }

        return(
            <div>
                <div className="news" >{newsTemplate}</div>
                <strong className={newsTemplate.length > 0 ? 'news__count' : 'none'}
                        onClick={this.countClick}>
                    Всего новостей:
                    {newsTemplate.length}
                </strong>
            </div>

        )
    }
}



class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {news: newsItem};
    };

    componentDidMount = () => {
      let self = this;
      window.ee.addListener('News.add', function(item){
          let nextNews = item.concat(self.state.news);
          self.setState({news: nextNews});
      });
    };

    componentWillUnmount = () => {
        window.ee.removeListener('News.add');
    };

    render() {
        return (
            <div className="app">
                <h3>News</h3>
                <Add/>
                <News data={this.state.news}/>
            </div>
        );
    }
}

const newsItem = [
    {
        author: 'Саша Печкин',
        text: 'В четчерг, четвертого числа...',
        bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
    },
    {
        author: 'Просто Вася',
        text: 'Считаю, что $ должен стоить 35 рублей!',
        bigText: 'А евро 42!'
    },
    {
        author: 'Гость',
        text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
        bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
    }
];

const element = document.getElementById('root');
ReactDOM.render(<App />, element);
