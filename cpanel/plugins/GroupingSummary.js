/**
 * GroupingSummary with TotalRow for Ext 4.0.7
 *
 * @author Mcaveti
 * @version 0.1
 * For Ext 4.0.7
 * 
 * This Extension adds a total summary row at the bottom of the view or at the last group
 * and adds a new property for the columns and GroupingSummary class.
 *
 * ## Example Usage
 *
 *  features: [
 *      {
 *          ftype: 'groupingsummary',       // this for example - not new property
 *          totalSummary: 'fixed',          // Can be: 'fixed', true, false. Default: false
 *          totalSummaryTopLine: true,      // Default: true
 *          totalSummaryColumnLines: true,  // Default: false
 *      }
 *  ]
 *
 *  columns: [
 *      {
 *          totalSummaryType: 'sum',        // Can be any summaryType. Default: summaryType
 *          totalSummaryText: 'Total:',     // Can be any text or Html
 *          summaryText: 'Total of group:', // Can be any text or Html
 *      }
 *  ]
 */

Ext.override(Ext.grid.feature.GroupingSummary, {

    getFragmentTpl: function () {
        var me = this,
            fragments = me.callParent();

        Ext.apply(fragments, me.getSummaryFragments());
        if (me.showSummaryRow) {
            me.summaryGroups = me.view.store.getGroups();
            me.summaryData = me.generateSummaryData();
            me.TotalSummaryData = me.generateTotalSummaryData(); // fix for total row
        }
        return fragments;
    },

    getPrintData: function (index) {
        var me = this,
            columns = me.view.headerCt.getColumnsForTpl(),
            i = 0,
            length = columns.length,
            data = []
        if (!me.summaryGroups[index - 1]) me.getFragmentTpl() // fix for add new row
        var name = me.summaryGroups[index - 1].name,
            active = me.summaryData[name],
            column;

        for (; i < length; ++i) {
            column = columns[i];
            column.gridSummaryValue = this.getColumnValue(column, active);
            data.push(column);
        }
        return data;
    },

    getPrintTotalData: function () { // new method for this class
        var me = this,
            columns = me.view.headerCt.getColumnsForTpl(),
            i = 0,
            length = columns.length,
            data = [],
            active = me.TotalSummaryData,
            column;

        for (; i < length; ++i) {
            column = columns[i];
            column.gridSummaryValue = this.getColumnValue(column, active);
            data.push(column);
        }
        return data;
    },

    generateTotalSummaryData: function () { // new method for this class
        var me = this,
            data = {},
            store = me.view.store,
            columns = me.view.headerCt.getColumnsForTpl(),
            i = 0,
            length = columns.length,
            fieldData, key, comp;

        for (i = 0, length = columns.length; i < length; ++i) {
            comp = Ext.getCmp(columns[i].id);
            data[comp.id] = comp.totalSummaryText ? comp.totalSummaryText : me.getSummary(store, (comp.totalSummaryType ? comp.totalSummaryType : comp.summaryType), comp.dataIndex, false);
        }
        return data;
    },

    generateSummaryData: function () {
        var me = this,
            data = {},
            remoteData = {},
            store = me.view.store,
            groupField = this.getGroupField(),
            reader = store.proxy.reader,
            groups = me.summaryGroups,
            columns = me.view.headerCt.getColumnsForTpl(),
            remote, i, length, fieldData, root, key, comp;

        for (i = 0, length = groups.length; i < length; ++i) {
            data[groups[i].name] = {};
        }

        if (me.remoteRoot && reader.rawData) {
            root = reader.root;
            reader.root = me.remoteRoot;
            reader.buildExtractors(true);
            Ext.Array.each(reader.getRoot(reader.rawData), function (value) {
                remoteData[value[groupField]] = value;
            });
            reader.root = root;
            reader.buildExtractors(true);
        }

        for (i = 0, length = columns.length; i < length; ++i) {
            comp = Ext.getCmp(columns[i].id);
            fieldData = me.getSummary(store, comp.summaryType, comp.dataIndex, true);

            if (comp.summaryText) { // fix for property summaryText
                for (key in data) {
                    data[key][comp.id] = comp.summaryText;
                }
            }

            for (key in fieldData) {
                if (fieldData.hasOwnProperty(key)) {
                    data[key][comp.id] = fieldData[key];
                }
            }

            for (key in remoteData) {
                if (remoteData.hasOwnProperty(key)) {
                    remote = remoteData[key][comp.dataIndex];
                    if (remote !== undefined && data[key] !== undefined) {
                        data[key][comp.id] = remote;
                    }
                }
            }
        }
        return data;
    },

    printSummaryRow: function (index) { // main modifed method
        var inner = this.view.getTableChunker().metaRowTpl.join(''),
            prefix = Ext.baseCSSPrefix;

        inner = inner.replace(prefix + 'grid-row', prefix + 'grid-row-summary');
        inner = inner.replace('{{id}}', '{gridSummaryValue}');
        inner = inner.replace(this.nestedIdRe, '{id$1}');
        inner = inner.replace('{[this.embedRowCls()]}', '{rowCls}');
        inner = inner.replace('{[this.embedRowAttr()]}', '{rowAttr}');
        inner = Ext.create('Ext.XTemplate', inner, {
            firstOrLastCls: Ext.view.TableChunker.firstOrLastCls
        });

        if (this.summaryGroups.length == index && this.totalSummary) {
            var totalInner = this.view.getTableChunker().metaRowTpl.join('');

            totalInner = totalInner.replace(prefix + 'grid-row', prefix + 'grid-row-totalsummary');
            totalInner = totalInner.replace('{{id}}', '{gridSummaryValue}');
            totalInner = totalInner.replace(this.nestedIdRe, '{id$1}');
            totalInner = totalInner.replace('{[this.embedRowCls()]}', '{rowCls}');
            totalInner = totalInner.replace('{[this.embedRowAttr()]}', '{rowAttr}');
            totalInner = totalInner.replace('{id-tdAttr}', '{id-tdAttr}style="font-weight: bold;"');
            if (this.totalSummaryTopLine || this.totalSummaryTopLine == undefined) totalInner = totalInner.replace('{id-tdAttr}style="', '{id-tdAttr}style="border-top: 1px solid #BCB1B0;');
            if (this.totalSummaryColumnLines) totalInner = totalInner.replace('{id-tdAttr}style="', '{id-tdAttr}style="border-right: 1px solid #BCB1B0;');

            if (this.totalSummary == 'fixed') {
                var rowID = this.view.id + "-totalsummaryrow",
                    cols = this.getPrintTotalData()

                totalInner = totalInner.replace('{id-tdAttr}style="', '{id-tdAttr}style="width:{width}px;');
                totalInner = Ext.create('Ext.XTemplate', totalInner, {
                    firstOrLastCls: Ext.view.TableChunker.firstOrLastCls
                });

                fixedSummaryRow = this.view.fixedSummaryRow = document.createElement('table');
                fixedSummaryRow.className = 'x-component x-grid-view x-component-default x-unselectable x-fit-item x-grid-row-totalsummary';
                fixedSummaryRow.id = rowID;
                fixedSummaryRow.cellspacing = 0;
                fixedSummaryRow.cellpadding = 0;
                fixedSummaryRow.style.borderRight = '2px solid #BCB1B0'
                fixedSummaryRow.style.tableLayout = 'fixed'
                fixedSummaryRow.style.left = '-1px';
                for (i in cols) {
                    if (cols[i].width === 0) cols[i].width = '0px;display:none;'
                }
                fixedSummaryRow.innerHTML = totalInner.applyTemplate({
                    columns: cols
                });

                if (!this.view.refreshCount) this.view.refreshCount = 0
                if (!this.view.EWA) {
                    this.view.EWA = true

                    Ext.util.CSS.createStyleSheet(".x-grid-row-totalsummary {background-color:#ffffff;}", 'x-grid-row-totalsummary');

                    function Do(ct, c, w, ev) {
                        var row = Ext.get(rowID).dom
                        row.style.width = ct.view.el.dom.children[0].clientWidth
                        var tr = row.lastChild.lastChild
                        var td = getElementsByClass('x-grid-cell-' + c.id, tr)[0].style
                        switch (ev) {
                            case 'r': td.width = w; break;
                            case 's': td.display = ''; break;
                            case 'h': td.display = 'none'; row.style.height = row.offsetHeight; break;
                        }
                    }

                    var id = this.view.el.dom.parentNode.id.replace('-body', ''),
                    grid = Ext.getCmp(id)
                    grid.on('columnresize', function (ct, column, width) {
                        Do(ct, column, width, 'r')
                    })
                    grid.on('columnshow', function (ct, column) {
                        Do(ct, column, '', 's')
                    })
                    grid.on('columnhide', function (ct, column) {
                        Do(ct, column, '', 'h')
                    })
                    grid.view.on('refresh', function () {
                        if (Ext.get(rowID)) Ext.get(rowID).destroy();
                        this.el.dom.appendChild(this.fixedSummaryRow);
                        var me = this;
                        if (!me.wasrefreshed) {
                            setTimeout(function () {
                                me.wasrefreshed = true;
                                me.fireEvent('refresh')
                            }, 12)
                        }
                        if (this.refreshCount != 3) this.refreshCount += 1
                        this.fireEvent('resize')
                    })
                    this.view.on('resize', function () {
                        var gridwidth = this.el.dom.children[0].clientWidth,
                        row = Ext.get(rowID)
                        row.dom.style.width = gridwidth
                        if (this.refreshCount == 3 && !Ext.isOpera) row.dom.style.left = ''
                        var dom = this.el.dom,
                        totalsummary = dom.lastChild;
                        if (totalsummary.summary === "") {
                            var top = dom.clientHeight - dom.children[0].clientHeight - dom.children[1].clientHeight + dom.scrollTop
                            totalsummary.style.top = top + "px"
                        }
                        this.Top = top
                    })
                    this.view.on('groupcollapse', function () {
                        this.fireEvent('resize')
                    })
                    this.view.on('groupexpand', function () {
                        this.fireEvent('resize')
                    })
                }
                var LastInner = inner.applyTemplate({ columns: this.getPrintData(index) })
                return LastInner + '<tr><td style="height: 22px;"></td></tr>';
            }
            totalInner = Ext.create('Ext.XTemplate', totalInner, {
                firstOrLastCls: Ext.view.TableChunker.firstOrLastCls
            });
            return inner.applyTemplate({ columns: this.getPrintData(index) }) + 
                   totalInner.applyTemplate({ columns: this.getPrintTotalData() })
        }
        return inner.applyTemplate({ columns: this.getPrintData(index) });
    }
});

Ext.override(Ext.panel.Table, {
    onVerticalScroll: function (event, target) {
        var owner = this.getScrollerOwner(),
            items = owner.query('tableview'),
            i = 0,
            len = items.length;

        for (; i < len; i++) {
            items[i].el.dom.scrollTop = target.scrollTop;
        }
        // fix for scrolling
        var dom = owner.view.el.dom
        var totalsummary = dom.lastChild;
        if (totalsummary.summary === "") {
            var top = dom.clientHeight - dom.scrollHeight + dom.scrollTop + (dom.clientHeight == dom.scrollHeight ? owner.view.Top : 0)
            totalsummary.style.top = top + "px"
            owner.view.Top = 0
        }
    },
});

Ext.override(Ext.view.Table, {
    onHeaderResize: function (header, w, suppressFocus) {
        var me = this,
            el = me.el;
        if (el) {
            me.saveScrollState();
            if (Ext.isIE6 || Ext.isIE7) {
                if (header.el.hasCls(Ext.baseCSSPrefix + 'column-header-first')) {
                    w += 1;
                }
            }
            el.select('.' + Ext.baseCSSPrefix + 'grid-col-resizer-' + header.id).setWidth(w);
            el.select('.' + Ext.baseCSSPrefix + 'grid-table-resizer').setWidth(me.headerCt.getFullWidth());
            me.restoreScrollState();
            if (!me.ignoreTemplate) {
                me.setNewTemplate();
            }
            if (!suppressFocus) {
                me.el.focus();
            }
            if (header.flex) { //fix for flex columns
                ownerHeaderCt = header.getOwnerHeaderCt();
                ownerHeaderCt.fireEvent('columnresize', ownerHeaderCt, header, w);
            }
        }
    },
    focusRow: function (rowIdx) {
        var me = this,
            row = me.getNode(rowIdx),
            el = me.el,
            adjustment = 0,
            panel = me.ownerCt,
            rowRegion, elRegion, record;

        if (row && el) {
            elRegion = el.getRegion();
            rowRegion = Ext.fly(row).getRegion();

            if (rowRegion.top < elRegion.top) {
                adjustment = rowRegion.top - elRegion.top;

            } else if (rowRegion.bottom > elRegion.bottom) {
                adjustment = rowRegion.bottom - elRegion.bottom;
            }
            record = me.getRecord(row);
            rowIdx = me.store.indexOf(record);

            if (adjustment) {
                if (me.fixedSummaryRow) adjustment += me.fixedSummaryRow.offsetHeight //fix
                panel.scrollByDeltaY(adjustment);
            }
            me.fireEvent('rowfocus', record, row, rowIdx);
        }
    }
});