if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (typeof _$jscoverage.branchFcn === 'undefined'){ _$jscoverage.branchFcn=function(f,l,c,r){ _$jscoverage[f].branchData[l][c].push(r);return r;};}
if (typeof _$jscoverage['branch_test_file'] === 'undefined'){_$jscoverage['branch_test_file']=[];
_$jscoverage['branch_test_file'].branchData=[];
_$jscoverage['branch_test_file'].source=['function BRANCHTEST(x){',
'return x === 1 ? true : false;',
'}'];
_$jscoverage['branch_test_file'][1]=0;
_$jscoverage['branch_test_file'][2]=0;
_$jscoverage['branch_test_file'].branchData[2] = [];
_$jscoverage['branch_test_file'].branchData[2][7] = [];
}_$jscoverage['branch_test_file'][1]++;
function BRANCHTEST(x){
_$jscoverage['branch_test_file'][2]++;
return _$jscoverage.branchFcn('branch_test_file',2,7,x === 1 )? true : false;
}