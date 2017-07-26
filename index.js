var table, search, listing, app;

// worlds lamest cloning function
function clone(object) {
  return JSON.parse(JSON.stringify(object));
}

// used by the table heading to set its class and trigger a sort
function sorts(listing, state, prop) {
  var className = (state.sort === prop) ? 'is-sorted' : '';
  return {
    className: className,
    onclick: function(e) {
      if (prop) {
        listing.sortBy(prop);
        state.sort = prop;
      }
    }
  }
};

// used by the table cells to trigger visual change
function col(state, prop) {
  var className = (state.sort === prop) ? 'is-sorted' : '';
  return {
    className: className
  };
}

// object for handling model
// the data is in another pen: https://codepen.io/dp_lewis/pen/MwPRaY
listing = {
  original: data,
  list: data,
  sortBy: function(prop) {
    var first = listing.list[0];
    listing.list.sort(function(a, b) {
      return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0
    });
    if (first === listing.list[0]) {
      listing.list.reverse();
    }
  },
  filter: function(prop) {
    listing.list = clone(listing.original);
    listing.list = listing.list.filter(function(obj) {
      if (obj.username.toLowerCase().indexOf(prop.toLowerCase()) !== -1 || obj.scamreport.toLowerCase().indexOf(prop.toLowerCase()) !== -1 || obj.amount.toLowerCase().indexOf(prop.toLowerCase()) !== -1) {
        return true;
      } else {
        return false;
      }
    });
  }
};

// table component
table = {
  controller: function(options) {
    this.listing = options.listing;
    this.tableState = options.tableState;
  },
  view: function(ctrl) {
    return m("table", [
      m("thead", [m("tr", [
        m("th", sorts(ctrl.listing, ctrl.tableState, 'username'), "Username"),
        m("th", sorts(ctrl.listing, ctrl.tableState, 'scamreport'), "Scam Report"),
        m("th", sorts(ctrl.listing, ctrl.tableState, 'amount'), "Amount")
      ])]),
      m("tbody", [
        ctrl.listing.list.map(function(person) {
          return m("tr", [
            m("td", col(this.tableState, 'username'), person.username),
            m("td", col(this.tableState, 'scamreport'), person.scamreport),
            m("td", col(this.tableState, 'amount'), person.amount)
          ])
        })
      ])
    ]);
  }
};

// search component
search = {
  controller: function(options) {
    this.listing = options.listing;
  },
  view: function(ctrl) {
    return m('form', [
      m('label', {
        for: 'search'
      }, 'Search'),
      m('input', {
        id: 'search',
        placeholder: 'e.g. Vishal Bains',
        oninput: m.withAttr("value", ctrl.listing.filter)
      })
    ]);
  }
}

// This is the main component that brings together the search and the table
// The main app passes the model to the sub components
app = {
  controller: function() {
    this.listing = listing;
    this.tableState = tableState;
  },
  view: function(ctrl) {
    return m('div', [
      m.component(search, {
        listing: ctrl.listing
      }),
      m.component(table, {
        listing: ctrl.listing,
        tableState: ctrl.tableState
      })
    ]);
  }
};

m.module(document.getElementById('app'), app);