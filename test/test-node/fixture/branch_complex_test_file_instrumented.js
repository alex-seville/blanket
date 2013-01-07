if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (typeof _$jscoverage.branchFcn === 'undefined'){ _$jscoverage.branchFcn=function(f,l,c,r){ _$jscoverage[f].branchData[l][c].push(r);return r;};}
if (typeof _$jscoverage['branch_complex_test_file'] === 'undefined'){_$jscoverage['branch_complex_test_file']=[];
_$jscoverage['branch_complex_test_file'].branchData=[];
_$jscoverage['branch_complex_test_file'].source=['function COMPLEXBRANCHTEST(x,y,z){',
'return x === 1 ? true : y === 2 ? z === 3 ? true : false : false;',
'}'];
_$jscoverage['branch_complex_test_file'][1]=0;
_$jscoverage['branch_complex_test_file'][2]=0;
_$jscoverage['branch_complex_test_file'].branchData[2] = [];
_$jscoverage['branch_complex_test_file'].branchData[2][34] = [];
_$jscoverage['branch_complex_test_file'].branchData[2] = [];
_$jscoverage['branch_complex_test_file'].branchData[2][24] = [];
_$jscoverage['branch_complex_test_file'].branchData[2] = [];
_$jscoverage['branch_complex_test_file'].branchData[2][7] = [];
}_$jscoverage['branch_complex_test_file'][1]++;
function COMPLEXBRANCHTEST(x,y,z){
_$jscoverage['branch_complex_test_file'][2]++;
return _$jscoverage.branchFcn('branch_complex_test_file',2,7,x === 1 )? true : _$jscoverage.branchFcn('branch_complex_test_file',2,24,y === 2 )? _$jscoverage.branchFcn('branch_complex_test_file',2,34,z === 3 )? true : false : false;
}