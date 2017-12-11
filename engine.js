function getCookie(c_name)
{
	if (document.cookie.length>0)
	{ 
		c_start=document.cookie.indexOf(c_name + "=")
		if (c_start!=-1)
		{ 
			c_start=c_start + c_name.length+1 
			c_end=document.cookie.indexOf(";",c_start)
			if (c_end==-1) c_end=document.cookie.length
				return unescape(document.cookie.substring(c_start,c_end))
		} 
	}
	return ""
}

function setCookie(c_name,value)
{
	document.cookie = c_name + "="+ escape (value) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";

}

function delAllCookie()
{    
	var myDate=new Date();    
	myDate.setTime(-1000);
	var data=document.cookie;    
	var dataArray=data.split(";");    
	for(var i=0;i<dataArray.length;i++)
	{    
		var varName=dataArray[i].split("=");    
		document.cookie=varName[0]+"=''; expires="+myDate.toGMTString();    
	}    
} 

function Game(levelFile)
{
	this.mCreated = false;
	this.mWidth = 15;
	this.mHeight = 5;
	this.mBlockPix = 100;
	this.mFieldArray = new Array();
	this.mUsedSteps = 0;
	this.mHistory="";
	this.mTarget=0;
	this.mIsFinished=false;
	this.mLevelFile=levelFile;
	
	this.mLevelXmlRequest = new XMLHttpRequest();
	
	if(this.LoadLevel(this.mLevelFile))
	{
		this.UpdateField();
		this.mCreated = true;
	}
}

Game.prototype.Move = function( direction )
{
	if(this.mIsFinished)
	{
		return;
	}
	var Moved = 0;
	var HistoryMark;
	if(direction==0) 
	{
		Moved = this.DoMoveLeft();
		HistoryMark="L";
	}
	if(direction==1) 
	{
		Moved = this.DoMoveUp();
		HistoryMark="U";
	}
	if(direction==2) 
	{
		Moved = this.DoMoveRight();
		HistoryMark="R";
	}
	if(direction==3) 
	{
		Moved = this.DoMoveDown();
		HistoryMark="D";
	}
	
	if(Moved)
	{
		this.mUsedSteps++;
		this.mHistory+=HistoryMark;
		this.UpdateField();
		this.UpdateUsedSteps();
		this.UpdateHistory();
		if(this.CheckFinished())
		{
			this.mIsFinished=true;
			setCookie(this.mLevelFile,"PASS");
		}
	}
}

/* 
	0:  blocks that can never be moved
	-2: there is no block here
	-3: marked the block to be cancaled
	>0: all normal blocks
*/
	
Game.prototype.DoMoveLeft = function( )
{
	if(this.mCreated == false)
	{
		return false;
	}
	
	var CanMove = 0;
	tmp = new Array();
	for(var j=0;j<this.mHeight;j++)
	{
		for(var i=0;i<this.mWidth;i++)
		{
			tmp[i]=this.mFieldArray[j][i];
		}
		for(var i=1;i<this.mWidth;i++)
		{
			if(tmp[i-1]==-2&&tmp[i]>0)
			{
				var a=tmp[i-1];
				tmp[i-1]=tmp[i];
				tmp[i]=a;
				i=0;
				CanMove=1;
			}
		}
		for(var i=0;i<this.mWidth-1;i++)
		{
			if(tmp[i]<=0) 
			{
				continue;
			}
			if(tmp[i]==tmp[i+1]&&tmp[i]<1000000)
			{
				tmp[i+1]=-3;
				CanMove=1;
			}
		}
		var wi=0;
		for(var i=0;i<this.mWidth;i++)
		{
			if(tmp[i]>0)
			{
				this.mFieldArray[j][wi]=tmp[i];
				wi++;
			}
			else if(tmp[i]==0)
			{
				while(i!=wi)
				{
					this.mFieldArray[j][wi]=-2;
					wi++;
				}
				this.mFieldArray[j][i]=0;
				wi++;
			}
			else if(tmp[i]==-2)
			{
				
			}
			else if(tmp[i]==-3)
			{
				this.mFieldArray[j][wi-1]=this.mFieldArray[j][wi-1]+1;
			}
			else
			{
				
			}
		}
		while(i!=wi)
		{
			this.mFieldArray[j][wi]=-2;
			wi++;
		}
	}
	buffer = [];
	return CanMove;
}

Game.prototype.DoMoveUp = function( )
{
	if(this.mCreated == false)
	{
		return false;
	}
	
	var CanMove = 0;
	tmp = new Array();
	for(var i=0;i<this.mWidth;i++)
	{
		for(var j=0;j<this.mHeight;j++)
		{
			tmp[j]=this.mFieldArray[j][i];
		}
		for(var j=1;j<this.mHeight;j++)
		{
			if(tmp[j-1]==-2&&tmp[j]>0)
			{
				var a=tmp[j-1];
				tmp[j-1]=tmp[j];
				tmp[j]=a;
				j=0;
				CanMove=1;
			}
		}
		for(var j=0;j<this.mHeight-1;j++)
		{
			if(tmp[j]<=0) 
			{
				continue;
			}
			if(tmp[j]==tmp[j+1]&&tmp[j]<1000000)
			{
				tmp[j+1]=-3;
				CanMove=1;
			}
		}
		var wj=0;
		for(var j=0;j<this.mHeight;j++)
		{
			if(tmp[j]>0)
			{
				this.mFieldArray[wj][i]=tmp[j];
				wj++;
			}
			else if(tmp[j]==0)
			{
				while(j!=wj)
				{
					this.mFieldArray[wj][i]=-2;
					wj++;
				}
				this.mFieldArray[j][i]=0;
				wj++;
			}
			else if(tmp[j]==-2)
			{
				
			}
			else if(tmp[j]==-3)
			{
				this.mFieldArray[wj-1][i]=this.mFieldArray[wj-1][i]+1;
			}
			else
			{
				
			}
		}
		while(j!=wj)
		{
			this.mFieldArray[wj][i]=-2;
			wj++;
		}
	}
	buffer = [];
	return CanMove;
}

Game.prototype.DoMoveRight = function( )
{
	if(this.mCreated == false)
	{
		return false;
	}
	
	var CanMove = 0;
	tmp = new Array();
	for(var j=0;j<this.mHeight;j++)
	{
		for(var i=0;i<this.mWidth;i++)
		{
			tmp[i]=this.mFieldArray[j][i];
		}
		for(var i=this.mWidth-2;i>=0;i--)
		{
			if(tmp[i+1]==-2&&tmp[i]>0)
			{
				var a=tmp[i+1];
				tmp[i+1]=tmp[i];
				tmp[i]=a;
				i=this.mWidth-2+1;
				CanMove=1;
			}
		}
		for(var i=this.mWidth-1;i>0;i--)
		{
			if(tmp[i]<=0) 
			{
				continue;
			}
			if(tmp[i]==tmp[i-1]&&tmp[i]<1000000)
			{
				tmp[i-1]=-3;
				CanMove=1;
			}
		}
		var wi=this.mWidth-1;
		for(var i=this.mWidth-1;i>=0;i--)
		{
			if(tmp[i]>0)
			{
				this.mFieldArray[j][wi]=tmp[i];
				wi--;
			}
			else if(tmp[i]==0)
			{
				while(i!=wi)
				{
					this.mFieldArray[j][wi]=-2;
					wi--;
				}
				this.mFieldArray[j][i]=0;
				wi--;
			}
			else if(tmp[i]==-2)
			{
				
			}
			else if(tmp[i]==-3)
			{
				this.mFieldArray[j][wi+1]=this.mFieldArray[j][wi+1]+1;
			}
			else
			{
				
			}
		}
		while(i!=wi)
		{
			this.mFieldArray[j][wi]=-2;
			wi--;
		}
	}
	buffer = [];
	return CanMove;	
}

Game.prototype.DoMoveDown = function( )
{
	if(this.mCreated == false)
	{
		return false;
	}
	
	var CanMove = 0;
	tmp = new Array();
	for(var i=0;i<this.mWidth;i++)
	{
		for(var j=0;j<this.mHeight;j++)
		{
			tmp[j]=this.mFieldArray[j][i];
		}
		for(var j=this.mHeight-2;j>=0;j--)
		{
			if(tmp[j+1]==-2&&tmp[j]>0)
			{
				var a=tmp[j+1];
				tmp[j+1]=tmp[j];
				tmp[j]=a;
				j=this.mHeight-2+1;
				CanMove=1;
			}
		}
		for(var j=this.mHeight-1;j>0;j--)
		{
			if(tmp[j]<=0) 
			{
				continue;
			}
			if(tmp[j]==tmp[j-1]&&tmp[j]<1000000)
			{
				tmp[j-1]=-3;
				CanMove=1;
			}
		}
		var wj=this.mHeight-1;
		for(var j=this.mHeight-1;j>=0;j--)
		{
			if(tmp[j]>0)
			{
				this.mFieldArray[wj][i]=tmp[j];
				wj--;
			}
			else if(tmp[j]==0)
			{
				while(j!=wj)
				{
					this.mFieldArray[wj][i]=-2;
					wj--;
				}
				this.mFieldArray[j][i]=0;
				wj--;
			}
			else if(tmp[j]==-2)
			{
				
			}
			else if(tmp[j]==-3)
			{
				this.mFieldArray[wj+1][i]=this.mFieldArray[wj+1][i]+1;
			}
			else
			{
				
			}
		}
		while(j!=wj)
		{
			this.mFieldArray[wj][i]=-2;
			wj--;
		}
	}
	buffer = [];
	return CanMove;
}

Game.prototype.UpdateUsedSteps = function( )
{
	document.getElementById('gamesteps').innerHTML = this.mUsedSteps;
}

Game.prototype.UpdateHistory = function( )
{
	document.getElementById('gamehistory').innerHTML = this.mHistory;
}

Game.prototype.UpdateField = function( )
{
	document.getElementById('gameblocks').style.width=60*this.mWidth;
	document.getElementById('gameblocks').style.height=60*this.mHeight;
	var str="";
	for(var i=0;i<this.mHeight;i++)
	{
		for(var j=0;j<this.mWidth;j++)
		{
			if(this.mFieldArray[i][j]>0&&this.mFieldArray[i][j]<1000000)
			{
				str+="<div style=\"background-color:#eeee00;\">"
				str+=Math.pow(2,this.mFieldArray[i][j]-1);
				str+="</div>";
			}
			else if(this.mFieldArray[i][j]==-2)
			{
				str+="<div style=\"background-color:#eeeeee;\">"
				str+="</div>";
			}
			else if(this.mFieldArray[i][j]==0)
			{
				str+="<div style=\"background-color:#222222;\">"
				str+="</div>";
			}
			else if(this.mFieldArray[i][j]==1000000)
			{
				str+="<div style=\"background-color:#eeee00;\">"
				str+="";
				str+="</div>";
			}
		}
	}

	var doc = document.getElementById("gameblocks");
	doc.innerHTML = str;
} 

Game.prototype.LoadLevel = function(url)
{
	this.mLevelXmlRequest.open("GET", url, false);
	this.mLevelXmlRequest.overrideMimeType("text/xml");
	try
	{
		this.mLevelXmlRequest.send(null);
	}
	catch(e)
	{
		alert("Failed To Load Level");
		return false;
	}
	
	var xml = this.mLevelXmlRequest.responseXML;
	if( xml==null )
	{
		alert( "Failed To Load Level" );
		return false;
	}
	
	var element_gameDescription = xml.getElementsByTagName("gameDescription");
	if( element_gameDescription.length!=1 )
	{
		alert( "Failed To Load Level" );
	}

    if( element_gameDescription[0].attributes["version"].value != "0.1" )
    {
        alert( "Not Supported Level Version" );
        return false;
    }
	
	var element_width =  element_gameDescription[0].getElementsByTagName("width");
    var element_height = element_gameDescription[0].getElementsByTagName("height");
	if(element_width.length!=1 || element_height.length!=1)
	{
		alert( "Level Parse Failed" );
		return false;
	}
	
	this.mWidth= parseInt(element_width[0].childNodes[0].nodeValue);
	this.mHeight= parseInt(element_height[0].childNodes[0].nodeValue);
	
	if(isNaN(this.mWidth))
	{
		alert( "Level Parse Failed" );
		return false;
	}
	if(isNaN(this.mHeight))
	{
		alert( "Level Parse Failed" );
		return false;
	}
	
	var element_target = element_gameDescription[0].getElementsByTagName("target");
	if(element_target.length!=1)
	{
		alert( "Level Parse Failed" );
		return false;
	}
	var strTarget= element_target[0].childNodes[0].nodeValue;
	strTarget = strTarget.replace(/[\r\n\t ]/g,"");
	strTarget = strTarget.toLowerCase();
	var c = strTarget.charCodeAt(0);
	if(c>=49&&c<=57)//[1,9]=>[1,9]
	{
		this.mTarget = c-48;
	}
	else if(c>=97&&c<=122)//[a,z]=>[10,35]
	{
		this.mTarget = c-97+10;
	}
	else
	{
		alert( "Level Parse Failed" );
		return false;
	}
			
	var element_map = element_gameDescription[0].getElementsByTagName("map");
	if(element_map.length!=1)
	{
		alert( "Level Parse Failed" );
		return false;
	}
	var mapstr = element_map[0].childNodes[0].nodeValue;
	mapstr = mapstr.replace(/[\r\n\t]/g,"");
	mapstr = mapstr.toLowerCase();
	
	if(this.mHeight*this.mWidth!=mapstr.length)
	{
		alert( "Level Parse Failed" );
		return false;
	}
	
	/* NOW HAVE GOT WIDTH,HEIGHT and THE DATA ARRAY */
	var stringIndex=0;
	for(var i=0;i<this.mHeight;i++)
	{
		this.mFieldArray[i] = new Array();
		for(var j=0;j<this.mWidth;j++)
		{
			var c = mapstr.charCodeAt(stringIndex);
			stringIndex++;
			if(c>=49&&c<=57)//[1,9]=>[1,9]
			{
				this.mFieldArray[i][j] = c-48;
			}
			else if(c>=97&&c<=122)//[a,z]=>[10,35]
			{
				this.mFieldArray[i][j] = c-97+10;
			}
			else if(c=='#'.charCodeAt(0))//[#]=>[0]
			{
				this.mFieldArray[i][j] = 0;
			}
			else if(c==' '.charCodeAt(0))//[ ]=>[-2]
			{
				this.mFieldArray[i][j] = -2;
			}
			else if(c=='.'.charCodeAt(0))//[.]=>[1000000]//big enough :-)
			{
				this.mFieldArray[i][j] = 1000000;
			}
			else
			{
				alert( "Level Parse Failed: Unrecognized Characters In Map" );
				return false;
			}
		}
	} 
	
	return true;
}


Game.prototype.CheckFinished = function()
{
	if(this.mCreated == false)
	{
		return false;
	}
	for(var i=0;i<this.mHeight;i++)
	{
		for(var j=0;j<this.mWidth;j++)
		{
			if(this.mFieldArray[i][j] == this.mTarget)
			{
				return true;
			}
		}
	}
	return false;
}