var wrapper = $( '.wrapper' ),
	host = $( '.host' );

host.val( window.location.href );

function extend( source, parent ){
	//var args = Array.prototype.slice( arguments, 1 );
	for( var p in parent ){
		source[p] = parent[p]
	}
	return source;
}

var KINDS = [ '请选择','会员','信贷','账务','票据'];

var data = [
	{
		name: '贷款列表',
		url: '/loan/loanList',
		kind: '2',
		type: 'get',
		description: '获取贷款列表',
		items: {
			username: 'jianggc',
			project: '绿城房产',
			amount: '1000',
			province: '33'
		}
	},
	{
		name: '申请贷款',
		url: '/loan/loanList',
		kind: '2',
		type: 'get',
		description: '获取贷款列表',
		items: {
			username: 'jianggc',
			project: '绿城房产',
			amount: '1000',
			province: '33'
		}
	},
	{
		name: '贷款状态',
		url: '/loan/loanList',
		kind: '2',
		type: 'get',
		description: '获取贷款列表',
		items: {
			username: 'jianggc',
			project: '绿城房产',
			amount: '1000',
			province: '33'
		}
	},
	{
		name: '会员注册',
		url: '/loan/loanList',
		kind: '1',
		type: 'get',
		description: '获取贷款列表',
		items: {
			username: 'jianggc',
			project: '绿城房产',
			amount: '1000',
			province: '33'
		}
	},
	{
		name: '会员登录',
		url: '/loan/loanList',
		kind: '1',
		type: 'get',
		description: '获取贷款列表',
		items: {
			username: 'jianggc',
			project: '绿城房产',
			amount: '1000',
			province: '33'
		}
	}
]

function Demo( config, renderTo ){
	this.isExit = !!config;
	this.init( config, renderTo );
}

extend( Demo.prototype, {

	defaults: {
		name: '',
		url: '',
		kind: '0',
		type: 'post',
		description: '',
		items: {
			'': ''
		}
	},

	init: function( config, renderTo ){
		config = config || this.defaults
		var el = this.render( config );
		this.setValue( config );
		if( typeof renderTo == 'function' ){
			renderTo( el );
		} else {
			wrapper.prepend( el );
		}
		
	},

	render: function( config ){
		var me = this,
			section = this.section = $( '<section>' ).addClass( 'clearfix' ).attr( 'id', config.url ),
			h2 = $( '<h2>' ),
			name = this.name = $( '<input>' ).attr( { 'type': 'text', placeHolder: '接口名'} ).addClass( 'name' ),
			kind = this.kind = $( '<select>' ),
            del = $( '<tt>' ).html( '-' ).addClass( 'remove' ),
			label = $( '<label>' ).addClass( 'clearfix' ),
			url = this.url = $( '<input>' ).attr( { 'type': 'text', placeHolder: '接口地址'} ).addClass( 'url' ),
			type = this.type = $( '<select>' ).addClass( 'type' ).append( new Option( 'POST', 'POST' ), new Option( 'GET', 'GET' ) ),
			description = this.description = $( '<textarea>' ).attr( { placeHolder: '接口描述'} ),
			form = this.form = $( '<form>' ),
			result = this.result = $( '<pre>' ),
			submit = this.submit = $( '<button>' ).attr( { type: 'submit' } ).html( '提交' ),
			save = $( '<button>' ).attr( { type: 'button' } ).addClass( 'save' ).html( '保存' );
		
		$.each( KINDS, function( k, v ){
			kind.append( new Option( v + '系统', k ) );
		});

		label.append( url, type );
		form.append( description, label, submit, save );
		h2.append( [ name, kind, del ] );
		section.append( [ h2, form, result ] );
		form.on( 'submit', function(){
			me.check( config );
			return false;
		} );

		save.on( 'click', function(){
			me.save( config );
		});

        del.on( 'click', function(){
            confirm('确定删除？不可恢复！！') && me.remove( config._id );
        });
		
		return section;
		
	},

	setValue: function( config ){
		this.name.val( config.name );
		this.kind.val( config.kind );
		this.description.val( config.description );
		this.url.val( config.url );
		this.type.val( config.type );
		this.submit.before( this.createItems( config.items || [] ) );
	},

    remove: function( id ){
        
        var me = this;
        $.ajax({
			url: '/interface/delServiceTest',
			type: 'get',
			dataType: 'json',
			data: { '_id': id },
			success: function( ret ){
				if( ret.code == 0 ){
                    me.section.remove();
                }
			},
			error: function( e ){
				console.log( e )
			},
			failed: function( e ){
				console.log( e )
			}
		});

    },

	check: function( config ){

		var me = this,
			data = {};
		$.each( this.form.find( '.filedset' ), function( k, item ){
			var fields = $( item ).find( 'input' );
			data[ fields[0].value ] = fields[1].value;
		} );
	
		$.ajax({
			url: host.val() + this.url.val(),
			type: this.type.val(),
			dataType: 'json',
			data: data,
			success: function( ret ){
				me.result.html( JSON.stringify( ret, null, 8 ) );
				if( me.url.val() == 'front/user/userLogin.htm' ){
					$.cookie.set( 'sso_cookie', ret.data.sso_cookie );
				} else if( me.url.val().indexOf( 'user/fetchSmsCode') > -1 ){
					$.cookie.set( 'sessionId', ret.data.sessionId );
				}
				return false;
			},
			error: function( e ){
				console.log( e )
				return false;
			},
			failed: function( e ){
				console.log( e )
				return false;
			}
		});

	},

	save: function( config ){
		
		var me = this,
			items = {},
			data = {
				id: config._id,
				name: this.name.val(),
				kind: this.kind.val(),
				description: this.description.val(),
				url: this.url.val(),
				type: this.type.val(),
				items: items
			};
		$.each( this.form.find( '.filedset' ), function( k, item ){
			var fields = $( item ).find( 'input' );
			items[ fields[0].value ] = fields[1].value;
		} );

		$.ajax({
			url: config._id ? '/interface/updateServiceTest' : '/interface/addServiceTest',
			type: 'get',
			dataType: 'json',
			data: data,
			success: function( ret ){
				me.result.html( !config._id ? '<p style="text-align:center;">|<br />|<br />|<br />|<br />V<p>' :JSON.stringify( ret, null, 8 ) );
				!config._id ? new Demo( data, function( el ){ $( 'section' ).first().after( el )} ) : '';
			},
			error: function( e ){
				console.log( e )
			},
			failed: function( e ){
				console.log( e )
			}
		});

	},

	createItems: function( data ){

		var me = this,
			items = [];

		$.each( data, function( field, value ){
			items.push( me.createItem( field, value ) );
		} );
		
		return items;

	},

	createItem: function( field, value ){
		var me = this,
			label = $( '<label>' ).addClass( 'filedset clearfix' ),
			field = $( '<input>' ).attr( { 'type': 'text', placeHolder: '字段名'} ).addClass( 'field' ).val( field || '' ),
			value = $( '<input>' ).attr( { 'type': 'text', placeHolder: '字段值'} ).addClass( 'value' ).val( value || '' ),
			del = $( '<tt>' ).addClass( 'del' ).html( '-' )
			add = $( '<tt>' ).addClass( 'add' ).html( '+' );
		
		label.append( [ field,'：', value, add, del ] );
		add.on( 'click', function(){
		
			label.after( me.createItem() );

		} );
		del.on( 'click', function(){
			
			label.remove();

		})
		return label;
	}

} );

//var demo = new Demo();

function init( data ){

	$.ajax({
		//url: '/interface/findServiceTest',
		url:'interface.json',
		type: 'get',
		data: {},
		dataType: 'json',
		success: function( ret ){
			if( ret.code == 0 ){
                ret.data.length && catalogInit( ret.data );
				ret.data.push( null );
				$.each( ret.data, function( k, item ){
					new Demo( item )
				} );
			}
		}
	});

}

init();


/********************************************************/
//catalog
var catalogBox = $( 'catalog' ),
    mask = $( 'mask' ),
    catalog = $( '.catalog' );
mask.on( 'click', function(){
    catalogBox.fadeOut();
    mask.fadeOut();
} )

$( 'body' ).on( 'dblclick', function(){
    catalogBox.fadeIn();
    mask.fadeIn();
});

function Catalog( config ){
    this.init( config )
}

extend( Catalog.prototype, {

    init: function( config ){
        this.render( config )
    },

    render: function( config ){
        
        var menu = this.createMenu( config.kinds ),
            main = this.createMain( config.main );
        catalog.append( menu, $( '<div>' ).addClass( 'clearfix catalogMainBox' ).append( main ) );

    },

    createMenu: function( data ){
        
        var me = this,
            el = this.menu = $( '<ul>' ).addClass( 'clearfix catalogMenu' ),
            li;
        $.each( data, function( key, value ){
            li = $( '<li>' ).html( KINDS[ value ] ).addClass( 'catalogMenuLi' + ( !key ? ' catalogMenuLiCur': '' ) );
            li.on( 'click', function(){
                me.handler( key )    
            });
            el.append( li );
        });
        return el;

    },

    handler: function( key ){
        
        this.menu.find( 'li' ).removeClass( 'catalogMenuLiCur' );
        $( this.menu.find( 'li' ).get( key ) ).addClass( 'catalogMenuLiCur' );
        $.each( this.els, function( k, el ){
            ( k != key ) ? el.hide() : el.show() ;
        })

    },

    createMain: function( data ){
        
        var els = this.els = [];
        $.each( data, function( key, tree ){
            var el = $( '<p>' ).addClass( 'clearfix catalogMain' );
            $.each( tree, function( key, value ){
                el.append( $( '<a>' ).html( value.name ).addClass( 'catalogMainLi' ).attr( 'href', '#' + value.url ) );
            });
            els.push( el );
        });
        els[0].show();
        return els;

    }

} );

function catalogInit( data ){
    var kinds = [1,2,3,4],
        tree = [[],[],[],[]];
    $.each( data, function( key, value ){
        tree[ value.kind-1 ] && tree[ value.kind-1 ].push( { url: value.url, name: value.name } );
    } );
    new Catalog( { kinds: kinds, main: tree } );
};

