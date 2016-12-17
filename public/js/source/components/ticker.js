const Ticker = React.createClass({
  getInitialState() {
    return {};
  },
  saveTicker() {
    if (this.props.saved) return;

    var self = this;

    $.ajax({
        url: '/saveTicker',
        type: 'POST',
        data: {
            symbol: this.props.tickerData.symbol
        },
        success: function(data) {
            self.props.addTicker(self.props.tickerData);
            // ADD TICKER SYMBOL TO CACHE
        },
        error: function(xhr, status, error) {
            swal({
                title: "Error!",
                text: xhr.responseJSON.error,
                type: "error",
                confirmButtonText: "OK"
            });
        }
    });
  },
  removeTicker() {
    if (!this.props.saved) return;

    var self = this;

    $.ajax({
        url: '/removeTicker',
        type: 'DELETE',
        data: {
            symbol: this.props.tickerData.symbol
        },
        success: function(data) {
            self.props.removeTicker(self.props.tickerData.symbol);
            //removeFromCache($(event.target).data('symbol'));
        },
        error: function(xhr, status, error) {
            swal({
                title: "Error!",
                text: xhr.responseJSON.error,
                type: "error",
                confirmButtonText: "OK"
            });
        }
    });
  },
  render() {
    var tickerContent = null;

    if (this.props.saved) {
      // Saved ticker

      tickerContent = (
        <div id={"panel-" + this.props.tickerData.symbol} className={"panel panel-default tickerItem savedTickerItem " + this.props.tickerData.change} data-symbol={this.props.tickerData.symbol}>
          <a data-toggle="collapse" data-parent="#accordion" href={"#collapse" + this.props.tickerData.symbol}>
              <div className="panel-heading">
                  <h3 className="panel-title">
                    {this.props.tickerData.symbol} <span className={"change-percent " + this.props.tickerData.change}>({this.props.tickerData.ChangeinPercent})</span>
                  </h3>
              </div>
          </a>
          <div id={"collapse" + this.props.tickerData.symbol} className={"panel-collapse collapse " + this.props.tickerData.change}>
              <div className="panel-body">
                  <div className="row">
                      <div className="col-xs-12 col-sm-6">
                          <TickerGraph
                              saved="true"
                              tickerData={this.props.tickerData} />
                      </div>
                      <div className="col-xs-12 col-sm-6">
                          <TickerStats
                              saved="true"
                              tickerData={this.props.tickerData}
                              updateTicker={this.props.updateTicker.bind(this)} />
                      </div>
                  </div>
                  <button type="button" className="btn btn-danger remove-ticker-btn pull-right" onClick={this.removeTicker}>Remove</button>
                  <div className="clearfix"></div>
              </div>
          </div>
        </div>
      );

    } else {
      // Search ticker

      var self = this;

      var addTickerBtn = null;
      var userTickers = this.props.userTickers();

      var tickerExists = userTickers.filter(function(ticker) { 
          return ticker.symbol === self.props.tickerData.symbol;
        }).length;

      if (!tickerExists) {
        addTickerBtn = (
          <span>
            <label className ="hidden" for="saveTickerBtn"> Add {this.props.tickerData.symbol} to Portfolio  </label>
            <button type="button" id="saveTickerBtn" className="btn btn-primary pull-right" onClick={this.saveTicker}><span className="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
            <div className="clearfix"></div>
          </span>
        );
      }

      tickerContent = (
        <div id="panel-search" className={"panel panel-default tickerItem " + this.props.tickerData.change}>
          <div className="panel-heading">
              <h3 className="panel-title">
                {this.props.tickerData.symbol} <span className={"change-percent " + this.props.tickerData.change}>({this.props.tickerData.ChangeinPercent})</span>
              </h3>
              {addTickerBtn}
          </div>
          <div className="panel-body">
              <div className="row">
                  <div className="col-xs-12 col-sm-6">
                      <TickerGraph
                        tickerData={this.props.tickerData} />
                  </div>
                  <div className="col-xs-12 col-sm-6">
                      <TickerStats
                        tickerData={this.props.tickerData} />
                  </div>
              </div>
          </div>
        </div>
      );

    }

    return tickerContent;
  }
});
